---
name: wasp-framework
description: Guidelines for building full-stack Web applications using the Wasp framework. Use when building React/Node.js full-stack apps where Wasp's declarative configuration handles routing, auth, and database setups.
---

# Wasp Framework Integration Guidelines

This skill provides the standard procedures and environment constraints for building full-stack web applications using the **Wasp** framework. Wasp uses a unique declarative DSL (`main.wasp`) alongside React and Node.js to fast-track development.

## 1. Project Setup
When initializing or configuring a Wasp application:
- You use the `wasp` CLI (`curl -sSL https://get.wasp.sh/installer.sh | sh`).
- Run `wasp new my-app` to scaffold inside a new directory. 
- Use TypeScript and Tailwind CSS natively supported via the `main.wasp` configuration file.

## 2. Architecture & The `.wasp` file
The core of every Wasp app is `main.wasp`. This file glues together React (client), Node.js/Express (server), and Prisma (database).

### Configuration Example
```wasp
app myWaspApp {
  wasp: {
    version: "^0.13.0"
  },
  title: "My App",
  db: {
    system: PostgreSQL
  },
  auth: {
    userEntity: User,
    methods: {
      usernameAndPassword: {}
    },
    onAuthFailedRedirectTo: "/login"
  }
}

route RootRoute { path: "/", to: MainPage }
page MainPage {
  component: import Main from "@src/MainPage.tsx"
}
```

## 3. Database Modeling (Prisma)
Entities and relationships are defined inside the `main.wasp` file using Prisma Schema Language (PSL). Wasp automatically sets up Prisma and database migrations.

```wasp
entity User {=psl
  id       Int     @id @default(autoincrement())
  username String  @unique
  password String
  tasks    Task[]
psl=}

entity Task {=psl
  id          Int     @id @default(autoincrement())
  description String
  isDone      Boolean @default(false)
  user        User    @relation(fields: [userId], references: [id])
  userId      Int
psl=}
```
- Migration generation is handled via `wasp db migrate-dev`.
- Update your `.env` file to contain `DATABASE_URL` pointing to your PostgreSQL instance.

## 4. Server-Side Execution (Operations)

Wasp divides server logic into **Queries** (reads) and **Actions** (writes).
You declare them in `main.wasp`, then implement in Node.js.

### Declaration in `main.wasp`
```wasp
query getTasks {
  fn: import { getTasks } from "@src/queries.ts",
  entities: [Task]
}

action createTask {
  fn: import { createTask } from "@src/actions.ts",
  entities: [Task]
}
```

### Implementation (`src/actions.ts`)
Wasp auto-generates types for arguments and contexts.

```typescript
import { Task } from 'wasp/entities';
import { CreateTask } from 'wasp/server/operations';

type CreateTaskPayload = { description: string };

export const createTask: CreateTask<CreateTaskPayload, Task> = async (args, context) => {
  if (!context.user) throw new Error('Unauthorized');
  
  return context.entities.Task.create({
    data: {
      description: args.description,
      user: { connect: { id: context.user.id } }
    }
  });
}
```

## 5. Client-Side Execution

Wasp auto-generates hooks for queries and actions on the client, caching responses via TanStack Query (React Query).

```tsx
import { useQuery, getTasks, createTask } from 'wasp/client/operations';

export function MainPage() {
  const { data: tasks, isLoading } = useQuery(getTasks);

  const handleAdd = async () => {
    await createTask({ description: 'New Task' });
  };

  if (isLoading) return 'Loading...';
  
  return (
    <div>
      <button onClick={handleAdd}>Add Task</button>
      {tasks?.map(t => <div key={t.id}>{t.description}</div>)}
    </div>
  );
}
```

## 6. Development Environment Constraints (AI Studio)

> [!CAUTION]
> **Port Binding Rules:** The application MUST bind its client to port `3000` and host `0.0.0.0`. All external traffic routes via an nginx reverse proxy exclusively to port 3000.

- For Wasp, the client runs on port `3000` (default) and the server typically binds to `3001`. Ensure the start command (`wasp start`) handles this via environment variables or configuring Wasp to correctly map its external URLs so the AI Studio preview environment functions.
- Specifically, configure the `PORT` and optionally the `CLIENT_PORT`/`SERVER_PORT` using AI Studio's constraints, acknowledging only port `3000` is exposed publicly.

## 7. Styling

- Use the native integration of Tailwind CSS that Wasp provides (`wasp-cli` templates).
- Add utilities to `src/index.css` and use the `@tailwind` directives.
