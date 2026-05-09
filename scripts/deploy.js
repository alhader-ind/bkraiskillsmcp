import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Try to load basic .env manually if dotenv isn't there, or just rely on standard env
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key.trim()]) {
      process.env[key.trim()] = value.trim();
    }
  });
}

console.log("🚀 Executing Pre-Deploy Matrix Checks...");

if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.error("\n❌ ERROR: Cloudflare Deployment Authentication Missing.");
  console.error("🔒 Please set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in your .env file or environment.");
  console.error("   You can get these from the Cloudflare Dashboard under 'My Profile > API Tokens'.");
  console.error("\nOnce set, run: npm run deploy\n");
  process.exit(1);
}

try {
  console.log("✅ Authentication secrets found.");
  console.log("🔨 Building the project...");
  execSync('npm run build', { stdio: 'inherit' });

  console.log("☁️  Deploying to Cloudflare Pages...");
  execSync('npx wrangler pages deploy dist --project-name bkraiskillsmcp', { stdio: 'inherit' });
  
  console.log("🎉 Deployment complete!");
  console.log("\n⚠️  REMINDER: For GitHub App Integration to work in production, ensure the following SECRETS are set in your Cloudflare Pages Dashboard:");
  console.log("   - GITHUB_APP_ID");
  console.log("   - GITHUB_WEBHOOK_SECRET");
  console.log("   - GITHUB_PRIVATE_KEY");
  console.log("   (Do NOT add these to plain-text 'vars' in wrangler.jsonc or they will conflict.)\n");
} catch (error) {
  console.error("\n❌ Deployment failed:", error.message);
  process.exit(1);
}
