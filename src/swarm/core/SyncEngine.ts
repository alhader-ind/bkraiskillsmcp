import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { GitHubAdapter, GitHubRepoConfig } from './GitHubAdapter';

const LLMS_TXT_PATH = './public/llms.txt';
const LLMS_FULL_PATH = './public/llms-full.txt';
const LLMS_JSON_PATH = './public/llms.json';

const CACHE_FILE = './.sync-cache.json';

export class SyncEngine {
  private github: GitHubAdapter;
  private srcDir: string;
  private destDir: string;

  constructor(options: { srcDir?: string; destDir?: string } = {}) {
    this.github = new GitHubAdapter();
    this.srcDir = options.srcDir || './src/raw-skills';
    this.destDir = options.destDir || './public/skills';
  }

  private loadCache(): Record<string, string> {
    if (fs.existsSync(CACHE_FILE)) {
      try {
        return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  private saveCache(cache: Record<string, string>) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  }

  /**
   * Sanitizes markdown content to prevent unauthorized code execution inside instructions
   */
  private sanitizeContent(content: string): string {
    // A simple sanitization boundary: strips out potentially risky bash/eval instructions if needed.
    // Real sanitization logic should be more robust.
    return content.replace(/eval\s*\(/gi, 'disabled_eval(');
  }

  public async fetchRemoteSkills(sources: GitHubRepoConfig[], token?: string) {
    if (!fs.existsSync(this.srcDir)) {
      fs.mkdirSync(this.srcDir, { recursive: true });
    }

    const cache = this.loadCache();

    console.log('Fetching remote skills concurrently...');

    // Process all remote repos concurrently using Promise.allSettled
    const results = await Promise.allSettled(
      sources.map(async (source) => {
        const files = await this.github.fetchDirectoryContents(source, { token });
        const itemsToProcess = [];

        if (!Array.isArray(files)) return;

        for (const f of files) {
          if (f.type === 'file' && f.name.endsWith('.md')) {
            itemsToProcess.push(f);
          } else if (f.type === 'dir') {
             // For subdirectories, fetch their skill.md concurrently if needed.
             // We can do another fetch here. Doing it sequentially for simplicity inside this branch, or map it.
             const dirFiles = await this.github.fetchDirectoryContents({
                name: source.name, repo: source.repo, branch: source.branch, basePath: `${source.basePath ? source.basePath + '/' : ''}${f.name}`
             }, { token });
             if (Array.isArray(dirFiles)) {
                const skillMd = dirFiles.find(df => df.name.toLowerCase() === 'skill.md' || df.name.toLowerCase() === 'instructions.md' || df.name.endsWith('.md'));
                if (skillMd) {
                  itemsToProcess.push({ ...skillMd, name: `${f.name}.md` });
                }
             }
          }
        }

        // Process all files concurrently
        await Promise.allSettled(itemsToProcess.map(async (file) => {
           const localPath = path.join(this.srcDir, `${source.name.toLowerCase()}-${file.name}`);
           const cacheKey = `github:${source.repo}:${file.path}`;
           const etag = cache[cacheKey];

           const { content, etag: newEtag, status } = await this.github.fetchFile(file.download_url, { token }, etag);

           if (status === 304) {
             console.log(`[Skipped] Unmodified: ${source.name} - ${file.name}`);
             return; // Unmodified, skip
           }

           if (content !== null) {
              let finalizedContent = content;
              if (!finalizedContent.includes('name:')) {
                const skillName = file.name.replace('.md', '');
                finalizedContent = `---\nname: ${source.name} ${skillName}\ndescription: Imported skill from ${source.name} repository.\n---\n\n${finalizedContent}`;
              }

              finalizedContent = this.sanitizeContent(finalizedContent);
              fs.writeFileSync(localPath, finalizedContent);
              if (newEtag) cache[cacheKey] = newEtag;
              console.log(`[Imported] ${source.name} - ${file.name}`);
           }
        }));
      })
    );

    results.forEach((result, idx) => {
       if (result.status === 'rejected') {
          console.error(`[SyncEngine] Failed to process source ${sources[idx].name}:`, result.reason);
       }
    });

    this.saveCache(cache);
  }

  public generateManifests(jsonOutput: boolean = false) {
    if (!fs.existsSync(this.destDir)) {
      fs.mkdirSync(this.destDir, { recursive: true });
    }

    const skills = fs.readdirSync(this.srcDir).filter(file => file.endsWith('.md'));
    const manifesto: any[] = [];
    let fullContent = `# SkillsGem AI - Full Knowledge Base\n\nThis document contains the full text of all AI technical skills for one-shot ingestion.\n\n`;

    skills.forEach(file => {
      const content = fs.readFileSync(path.join(this.srcDir, file), 'utf-8');
      
      const matchName = content.match(/(?:name|title):\s*(.*)/i);
      const matchDesc = content.match(/description:\s*(.*)/i);
      
      const name = matchName ? matchName[1].trim() : file.replace('.md', '');
      const description = matchDesc ? matchDesc[1].trim() : '';

      fullContent += `\n---\n\n# Skill: ${name}\nDescription: ${description}\n\n${content}\n`;

      const estimatedTokens = Math.ceil(content.length / 4);
      const categories = content.match(/#+.*(Frontend|Backend|Security|Database|QA|Testing|Middleware|API|Auth|UI)/i) 
                          ? content.match(/#+.*(Frontend|Backend|Security|Database|QA|Testing|Middleware|API|Auth|UI)/ig)!.map(m => m.replace(/#+\s*/, '')) 
                          : ["General"];
      
      // Compute hash
      const hash = crypto.createHash('sha256').update(content).digest('hex');

      fs.writeFileSync(path.join(this.destDir, file), content);
      
      manifesto.push({
        name,
        description,
        estimatedTokens,
        tags: categories,
        hash,
        path: `/skills/${file}`,
        rawUrl: `https://bkraiskillsmcp.pages.dev/api/skills?id=${file.replace('.md', '')}&mode=text`
      });
    });

    let llmsTxt = `# SkillsGem AI Knowledge Base\n\n> [!IMPORTANT]\n> This is a machine-readable index of high-fidelity AI System Instructions (Skills). \n> These instructions are designed to be ingested by LLMs to augment their capabilities in specific technical domains.\n\n`;
    llmsTxt += `> [!CRITICAL] CONTEXT BLOAT & COST OPTIMIZATION\n> Avoid ingesting the monolithic \`/llms-full.txt\` unless your context window exceeds 128k tokens.\n> **Recommended Protocol for Autonomous Agents:**\n> 1. Read \`/llms.json\` for semantic discovery and token estimation.\n> 2. Use \`/api/skills?tag=[category]\` or \`/api/skills?keyword=[problem]\` to find relevant competencies.\n> 3. Fetch specific skill instructions via \`/api/skills?id=[skill-id]&mode=text\` to maintain high focus and low token cost.\n\n`;
    llmsTxt += `## Primary Manifests\n\n- [Full Knowledge Base (Monolith)](/llms-full.txt): Total platform state (Verbatim content).\n- [Dynamic Manifest (JSON)](/llms.json): Full metadata, tags, and token counts for programmatic ingestion.\n\n## Available Competencies\n\n`;

    manifesto.forEach(s => {
      const id = s.path.split('/').pop()?.replace('.md', '');
      llmsTxt += `### [${s.name}](/api/skills?id=${id}&mode=text)\n- **Description**: ${s.description}\n- **Tags**: ${s.tags.join(', ')}\n- **Tokens**: ~${s.estimatedTokens}\n- **Granular API**: \`/api/skills?id=${id}&mode=text\`\n\n`;
    });

    fs.writeFileSync(LLMS_TXT_PATH, llmsTxt);
    fs.writeFileSync(LLMS_FULL_PATH, fullContent);
    fs.writeFileSync(LLMS_JSON_PATH, JSON.stringify(manifesto, null, 2));

    const WELL_KNOWN_DIR = './public/.well-known';
    if (!fs.existsSync(WELL_KNOWN_DIR)) {
      fs.mkdirSync(WELL_KNOWN_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(WELL_KNOWN_DIR, 'llms.txt'), llmsTxt);

    const MEMORY_FILES = ['MEMORY.md', 'ROADMAP.md', 'CHANGELOG.md', 'APP_ANALYSIS_REPORT.md', 'AGENTS.md'];
    MEMORY_FILES.forEach(file => {
      if (fs.existsSync(`./${file}`)) {
        fs.copyFileSync(`./${file}`, path.join('./public', file));
      }
    });

    if (jsonOutput) {
       console.log(JSON.stringify({ status: 'success', synced: manifesto.length, files: manifesto }));
    } else {
       console.log(`Sync complete. Indexed ${manifesto.length} skills at /llms.txt and /.well-known/llms.txt`);
    }
  }
}
