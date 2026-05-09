import { GitHubAuthService } from './githubAuth.js';

export class GitHubPRService {
  private service: GitHubAuthService;

  constructor(private appId: string, private privateKey: string) {
    this.service = new GitHubAuthService(appId, privateKey);
  }

  private async request(token: string, path: string, options: RequestInit = {}) {
    const url = `https://api.github.com${path}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'SkillsGem-MCP-App',
      ...options.headers
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub API Error (${response.status}) at ${path}: ${body}`);
    }
    return response.json();
  }

  async createPullRequest(params: {
    owner: string;
    repo: string;
    baseBranch: string;
    newBranch: string;
    title: string;
    body: string;
    files: { path: string; content: string }[];
  }) {
    const { owner, repo, baseBranch, newBranch, title, body, files } = params;

    // 0. Ensure we have an active installation access token
    const token = await this.service.getInstallationAccessToken();

    // 1. Get Base Branch Ref -> Commit SHA
    const refData = await this.request(token, `/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`);
    const baseCommitSha = refData.object.sha;

    // 2. Get Commit -> Tree SHA
    const commitData = await this.request(token, `/repos/${owner}/${repo}/git/commits/${baseCommitSha}`);
    const baseTreeSha = commitData.tree.sha;

    // 3. Create Tree
    const treeItems = files.map(f => ({
      path: f.path,
      mode: '100644', // file (blob)
      type: 'blob',
      content: f.content
    }));

    const newTreeData = await this.request(token, `/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeItems
      })
    });
    const newTreeSha = newTreeData.sha;

    // 4. Create Commit
    const newCommitData = await this.request(token, `/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: title,
        tree: newTreeSha,
        parents: [baseCommitSha]
      })
    });
    const newCommitSha = newCommitData.sha;

    // 5. Create Ref (Branch)
    await this.request(token, `/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${newBranch}`,
        sha: newCommitSha
      })
    });

    // 6. Create PR
    const prData = await this.request(token, `/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body,
        head: newBranch,
        base: baseBranch
      })
    });

    return {
      pr_url: prData.html_url,
      pr_number: prData.number,
      branch: newBranch,
      commit_sha: newCommitSha
    };
  }
}
