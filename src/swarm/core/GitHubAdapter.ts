import fetch from 'node-fetch';

export interface GitHubRepoConfig {
  name: string;
  repo: string;
  branch?: string;
  basePath?: string;
}

export interface FetchContext {
  token?: string;
}

export class GitHubAdapter {
  /**
   * Fetches the contents of a directory on GitHub, handling pagination and rate limits.
   */
  async fetchDirectoryContents(config: GitHubRepoConfig, context: FetchContext = {}) {
    const branch = config.branch || 'main';
    const basePath = config.basePath || '';
    const apiUrl = `https://api.github.com/repos/${config.repo}/contents/${basePath}?ref=${branch}`;

    return this.fetchWithRetry(apiUrl, context);
  }

  /**
   * Fetches a file from GitHub, returning its content and its ETag for caching purposes.
   */
  async fetchFile(downloadUrl: string, context: FetchContext = {}, etag?: string): Promise<{ content: string | null; etag: string | null; status: number }> {
    const headers: Record<string, string> = {};
    if (context.token) {
      headers['Authorization'] = `token ${context.token}`;
    }
    if (etag) {
      headers['If-None-Match'] = etag;
    }

    try {
      const response = await fetch(downloadUrl, { headers });
      
      const newEtag = response.headers.get('etag');
      
      if (response.status === 304) {
        return { content: null, etag, status: 304 }; // Not modified
      }

      if (!response.ok) {
        return { content: null, etag: null, status: response.status };
      }

      const content = await response.text();
      return { content, etag: newEtag, status: response.status };
    } catch (err: any) {
      console.error(`[GitHubAdapter] Error fetching file ${downloadUrl}: ${err.message}`);
      return { content: null, etag: null, status: 500 };
    }
  }

  private async fetchWithRetry(url: string, context: FetchContext, retries = 3, backoff = 1000): Promise<any> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Agent-Swarm-CLI'
    };
    if (context.token) {
      headers['Authorization'] = `token ${context.token}`;
    }

    try {
      const response = await fetch(url, { headers });

      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      if (rateLimitRemaining !== null && parseInt(rateLimitRemaining, 10) < 5) {
        console.warn(`[WARNING] GitHub API rate limit is very low: ${rateLimitRemaining} remaining`);
      }

      if (response.status === 403 || response.status === 429) {
        if (retries > 0) {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          let waitTime = backoff;
          if (resetTime) {
            const resetMs = parseInt(resetTime, 10) * 1000;
            const now = Date.now();
            // Wait up to 60 seconds if reset is upcoming, else default backoff
            if (resetMs > now && resetMs - now < 60000) { 
               waitTime = resetMs - now + 1000;
            }
          }
          console.log(`[GitHubAdapter] Rate limited. Retrying in ${waitTime}ms... (${retries} retries left)`);
          await new Promise(r => setTimeout(r, waitTime));
          return this.fetchWithRetry(url, context, retries - 1, backoff * 2);
        } else {
          throw new Error('Rate limit exceeded and max retries reached.');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // Implement Pagination parsing
      const linkHeader = response.headers.get('Link');
      if (linkHeader && Array.isArray(data)) {
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        if (nextMatch && nextMatch[1]) {
           const nextUrl = nextMatch[1];
           console.log(`[GitHubAdapter] Following pagination to next page: ${nextUrl}`);
           const nextData = await this.fetchWithRetry(nextUrl, context, retries, backoff);
           if (Array.isArray(nextData)) {
              return data.concat(nextData);
           }
        }
      }

      return data;
    } catch (error: any) {
      if (retries > 0 && (error.message.includes('network') || error.message.includes('fetch'))) {
         console.log(`[GitHubAdapter] Network error (${error.message}). Retrying in ${backoff}ms...`);
         await new Promise(r => setTimeout(r, backoff));
         return this.fetchWithRetry(url, context, retries - 1, backoff * 2);
      }
      throw error;
    }
  }
}
