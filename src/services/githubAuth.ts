import { importPKCS8, SignJWT } from 'jose';

// Simple edge-compatible memory cache for tokens
interface TokenCache {
  token: string;
  expiresAt: number;
}
const installationTokenCache = new Map<string, TokenCache>();

export class GitHubAuthService {
  private appId: string;
  private privateKey: string;

  constructor(appId: string, privateKey: string) {
    this.appId = appId;
    // Replace literal \n with actual newlines if necessary, commonly needed for env vars
    this.privateKey = privateKey.replace(/\\n/g, '\n'); 
  }

  /**
   * Generates a GitHub App JWT
   */
  async generateAppJWT(): Promise<string> {
    if (!this.appId || !this.privateKey) {
      throw new Error('GitHub App ID or Private Key is missing');
    }

    const privateKeyObj = await importPKCS8(this.privateKey, 'RS256');

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60, // 60 second clock skew
      exp: now + (10 * 60), // 10 minutes maximum expiration
      iss: this.appId,
    };

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .sign(privateKeyObj);

    return jwt;
  }

  /**
   * Fetches the first installation ID for the App
   */
  async getFirstInstallationId(jwt: string): Promise<number> {
    const response = await fetch('https://api.github.com/app/installations', {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SkillsGem-MCP-App'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch installations: ${response.status} ${errorText}`);
    }

    const installations = await response.json() as any[];
    if (!installations || installations.length === 0) {
      throw new Error('No installations found for this GitHub App.');
    }

    return installations[0].id;
  }

  /**
   * Generates an Installation Access Token
   */
  async getInstallationAccessToken(installationId?: number): Promise<string> {
    // 1. Generate App JWT
    const jwt = await this.generateAppJWT();

    // 2. Resolve Installation ID if not provided
    const targetInstallationId = installationId || await this.getFirstInstallationId(jwt);
    const cacheKey = `install_${targetInstallationId}`;

    // 3. Return cached token if valid (with 60s buffer)
    const cached = installationTokenCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now() + 60000) {
      return cached.token;
    }

    // 4. Request new Installation Token
    const url = `https://api.github.com/app/installations/${targetInstallationId}/access_tokens`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SkillsGem-MCP-App'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate installation token: ${response.status} ${errorText}`);
    }

    const data = await response.json() as any;
    
    // 5. Cache the new token
    // data.expires_at is an ISO8601 string
    const expiresAt = new Date(data.expires_at).getTime();
    installationTokenCache.set(cacheKey, {
      token: data.token,
      expiresAt: expiresAt
    });

    return data.token;
  }
}
