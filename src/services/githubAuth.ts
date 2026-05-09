import { importPKCS8, SignJWT } from 'jose';

// Helper to convert GitHub's default PKCS#1 (RSA PRIVATE KEY) to PKCS#8 (PRIVATE KEY)
// WebCrypto (used by Cloudflare Workers) strictly requires PKCS#8
function convertPKCS1toPKCS8(pkcs1Pem: string): string {
  // If it's already PKCS#8, just clean it up and return
  if (pkcs1Pem.includes('BEGIN PRIVATE KEY')) {
    return pkcs1Pem.replace(/\\n/g, '\n').trim();
  }

  const stripped = pkcs1Pem
      .replace(/\\n/g, '\n')
      .replace(/-----BEGIN RSA PRIVATE KEY-----/g, '')
      .replace(/-----END RSA PRIVATE KEY-----/g, '')
      .replace(/\s+/g, '');
  
  const binary = atob(stripped);
  const p1Array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
      p1Array[i] = binary.charCodeAt(i);
  }

  // PKCS#8 RSA prefix wrapper
  const prefix = new Uint8Array([
      0x30, 0x82, ((p1Array.length + 22) >> 8) & 0xff, (p1Array.length + 22) & 0xff,
      0x02, 0x01, 0x00,
      0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00,
      0x04, 0x82, (p1Array.length >> 8) & 0xff, p1Array.length & 0xff
  ]);

  const p8Array = new Uint8Array(prefix.length + p1Array.length);
  p8Array.set(prefix, 0);
  p8Array.set(p1Array, prefix.length);

  let p8Binary = "";
  for (let i = 0; i < p8Array.length; i++) {
      p8Binary += String.fromCharCode(p8Array[i]);
  }
  
  const b64 = btoa(p8Binary);
  const lines = b64.match(/.{1,64}/g) || [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`;
}

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
    // Autoconvert PKCS#1 from GitHub to PKCS#8 for Edge Crypto
    this.privateKey = convertPKCS1toPKCS8(privateKey); 
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
