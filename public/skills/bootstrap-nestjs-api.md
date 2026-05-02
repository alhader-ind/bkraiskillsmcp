---
name: bootstrap-nestjs-api
description: Strict, step-by-step initialization protocol for building a NestJS TypeScript API. Bypasses interactive prompts for enterprise backends.
tags: [bootstrap, nestjs, typescript, backend, api, express]
---

# Bootstrap Protocol: NestJS API

**Use Case:** The user requests an enterprise-grade backend API, a microservice architecture, or a strictly typed Node.js application using the NestJS framework.

> [!CRITICAL] INTERACTIVE CLI WARNING
> The standard `@nestjs/cli` is highly interactive and will stall the AI agent. You MUST bypass all prompts using explicit command flags.

## Step 1: Force Non-Interactive Scaffolding
Execute the NestJS CLI with flags that force strict mode and specify the package manager directly, avoiding any human prompts.

**Execution Command:**
```bash
npx -y @nestjs/cli new . --package-manager npm --strict
```
*(Run this command in the target directory, `.` represents current directory)*

## Step 2: Validate System Files
Verify that the `nest-cli.json`, `tsconfig.json`, and `package.json` were generated correctly. Do NOT edit the `package.json` manually unless dependencies are missing.

## Step 3: Implement Initial Configuration
NestJS creates a basic structure. Apply essential best-practice configurations immediately.

**Update `src/main.ts`**
Enforce global validation pipes and CORS configurations early to prevent downstream headaches.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend integrations
  app.enableCors({
    origin: '*', // Restrict this in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Enable global validation (requires class-validator and class-transformer)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 3001; // Avoid 3000 to prevent frontend collisions
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
```

## Step 4: Install Validation Dependencies
Since global validation was added, you must install the required dependencies non-interactively.

**Execution Command:**
```bash
npm install class-validator class-transformer
```

## Step 5: Boilerplate App Controller Update
Update the default `app.controller.ts` to serve as a clear healthcheck endpoint.

**Update `src/app.controller.ts`**
```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealthInfo() {
    return {
      status: 'ok',
      framework: 'NestJS',
      message: 'Enterprise backend structure successfully scaffolded.'
    };
  }
}
```

## Step 6: Verify & Yield
Execute `compile_applet` and run `npm run start:dev` to ensure the server starts without stalling. Make sure the health check responds correctly.
