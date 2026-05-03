import React from 'react';
import { 
  Box, Cpu, LayoutTemplate, 
  Image as ImageIcon, Fingerprint, Network, Boxes, TerminalSquare,
  MousePointer2, Cloud, Wrench, Database, FileText, ShieldAlert,
  BrainCircuit, Layers, Share2, Server
} from 'lucide-react';
import { Skill } from '../types';

/**
 * Static list of innate domain skills available to the AI.
 */
export const SKILLS_LIST: Skill[] = [
  {
    name: "Google Search Grounding",
    id: "google-search-grounding",
    icon: <Wrench className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600",
    description: "Real-time info retrieval from Google Search.",
    examples: [
      "Finding current news or events.",
      "Researching high-authority domains.",
      "Synthesizing web data with citations."
    ]
  },
  {
    name: "Python Code Execution",
    id: "python-code-execution",
    icon: <Cpu className="w-5 h-5" />,
    color: "bg-yellow-50 text-yellow-600",
    description: "Secure sandbox for code execution and data analysis.",
    examples: [
      "Mathematical calculations and complex problem solving.",
      "Data analysis and plotting charts.",
      "Iterative debugging of logic bugs."
    ]
  },
  {
    name: "Multimodal Vision",
    id: "multimodal-vision",
    icon: <ImageIcon className="w-5 h-5" />,
    color: "bg-purple-50 text-purple-600",
    description: "Processing and understanding visual inputs.",
    examples: [
      "OCR (Optical Character Recognition) from images.",
      "Scene analysis and object identification.",
      "Correlating text prompts with visual data."
    ]
  },
  {
    name: "Document Summarization",
    id: "document-summarization",
    icon: <FileText className="w-4 h-4" />,
    color: "bg-emerald-50 text-emerald-600",
    description: "Analyzing and extracting data from large documents.",
    examples: [
      "Mapping document structures and headers.",
      "Extracting core theses and supporting arguments.",
      "Converting unstructured text into tables or JSON."
    ]
  },
  {
    name: "API Function Caller",
    id: "api-function-caller",
    icon: <Box className="w-5 h-5" />,
    color: "bg-orange-50 text-orange-600",
    description: "Structured JSON output for external software interaction.",
    examples: [
      "Routing requests to specific API tools.",
      "Extracting structured parameters for function calls.",
      "Handling multi-step tool sequences."
    ]
  },
  {
    name: "Systems Architect",
    id: "systems-architect",
    icon: <Network className="w-5 h-5" />,
    color: "bg-indigo-50 text-indigo-600",
    description: "Planning technical stack and file structures.",
    examples: [
      "Designing complex application file-trees.",
      "Planning build orders for multi-file features.",
      "Recommending modern tech stacks for specific needs."
    ]
  },
  {
    name: "Frontend Engineer",
    id: "frontend-engineer",
    icon: <LayoutTemplate className="w-5 h-5" />,
    color: "bg-fuchsia-50 text-fuchsia-600",
    description: "Clean, responsive UI component development.",
    examples: [
      "Building accessible React components from scratch.",
      "Designing mobile-first layouts with Tailwind CSS.",
      "Implementing complex frontend state interactions."
    ]
  },
  {
    name: "Backend Engineer",
    id: "backend-engineer",
    icon: <Cpu className="w-5 h-5" />,
    color: "bg-rose-50 text-rose-600",
    description: "Secure, optimized server-side logic and APIs.",
    examples: [
      "Building secure authentication systems with JWT.",
      "Designing efficient REST or GraphQL API routes.",
      "Implementing robust server-side error handling."
    ]
  },
  {
    name: "Surgical Debugger",
    id: "surgical-debugger",
    icon: <Wrench className="w-5 h-5" />,
    color: "bg-sky-50 text-sky-600",
    description: "Pinpointing and fixing exact bugs with minimal changes.",
    examples: [
      "Patching critical logic errors in small diffs.",
      "Identifying root causes of obscure runtime failures.",
      "Highlighting exact lines for manual fixes."
    ]
  },
  {
    name: "Context Manager",
    id: "context-manager",
    icon: <FileText className="w-4 h-4" />,
    color: "bg-amber-50 text-amber-600",
    description: "Project state documentation and handoff.",
    examples: [
      "Summarizing codebase state for new chat sessions.",
      "Documenting completed vs pending tasks.",
      "Mapping known bugs and architecture details."
    ]
  },
  {
    name: "Prompt Optimizer",
    id: "prompt-optimizer",
    icon: <MousePointer2 className="w-5 h-5" />,
    color: "bg-violet-50 text-violet-600",
    description: "Refining vague requests into expert prompts.",
    examples: [
      "Generating 'Role/Instructions/Constraints' prompts.",
      "Identifying missing context in user requests.",
      "Optimizing prompts for better structured output."
    ]
  },
  {
    name: "CoT Reasoner",
    id: "step-by-step-reasoner",
    icon: <Cpu className="w-5 h-5" />,
    color: "bg-slate-50 text-slate-600",
    description: "Step-by-step logical deduction for complex problems.",
    examples: [
      "Solving multi-step logic puzzles or math problems.",
      "Evaluating multiple solution paths in a Thinking Space.",
      "Self-correcting during the reasoning phase."
    ]
  },
  {
    name: "Data Extractor",
    id: "data-extraction-specialist",
    icon: <Boxes className="w-5 h-5" />,
    color: "bg-teal-50 text-teal-600",
    description: "Converting unstructured text into clean JSON data.",
    examples: [
      "Parsing contact info from raw email text.",
      "Extracting entities like names, dates, and prices.",
      "Automating data entry from unstructured sources."
    ]
  },
  {
    name: "Red Team Reviewer",
    id: "code-reviewer-red-team",
    icon: <Boxes className="w-5 h-5" />,
    color: "bg-red-50 text-red-600",
    description: "Security-first code audits and vulnerability checking.",
    examples: [
      "Identifying SQL injection or XSS vulnerabilities.",
      "Reviewing code for exposed secrets or leaks.",
      "Performing performance bottleneck analysis."
    ]
  },
  {
    name: "Tech Documenter",
    id: "technical-documenter",
    icon: <FileText className="w-4 h-4" />,
    color: "bg-gray-50 text-gray-600",
    description: "Bridging the gap between code and documentation.",
    examples: [
      "Generating comprehensive README.md files.",
      "Documenting API endpoints and parameter types.",
      "Writing clear setup and installation guides."
    ]
  },
  {
    name: "Style Mimic",
    id: "tone-style-mimic",
    icon: <Fingerprint className="w-5 h-5" />,
    color: "bg-pink-50 text-pink-600",
    description: "Linguistic adaptation for brand or persona voice.",
    examples: [
      "Rewriting technical info for social media tonality.",
      "Mimicking specific character or brand personas.",
      "Adapting vocabulary and pacing for audience fit."
    ]
  },
  {
    name: "Creative Brainstormer",
    id: "divergent-brainstormer",
    icon: <Boxes className="w-5 h-5" />,
    color: "bg-yellow-50 text-yellow-600",
    description: "Divergent thinking for out-of-the-box ideas.",
    examples: [
      "Generating 10 wildly different project concepts.",
      "Combining unrelated industries for innovation.",
      "Generating catchy titles for creative projects."
    ]
  },
  {
    name: "DB Architect",
    id: "database-architect",
    icon: <Database className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600",
    description: "Normalization-focused schema design (SQL/NoSQL).",
    examples: [
      "Designing complex normalized relational schemas.",
      "Creating ERD diagrams with primary/foreign keys.",
      "Optimizing schemas for query performance."
    ]
  },
  {
    name: "API Integrator",
    id: "api-integrator",
    icon: <Network className="w-5 h-5" />,
    color: "bg-indigo-50 text-indigo-600",
    description: "Secure third-party service connections.",
    examples: [
      "Connecting Stripe payments and webhooks.",
      "Implementing OAuth 2.0 flows securely.",
      "Handling API rate limiting and server errors."
    ]
  },
  {
    name: "Code Converter",
    id: "code-converter",
    icon: <TerminalSquare className="w-5 h-5" />,
    color: "bg-orange-50 text-orange-600",
    description: "Idiomatic translation across languages and frameworks.",
    examples: [
      "Translating Python logic into TypeScript components.",
      "Converting class components to functional components.",
      "Adapting logic for different language paradigms."
    ]
  },
  {
    name: "QA Test Engineer",
    id: "qa-test-engineer",
    icon: <Wrench className="w-5 h-5" />,
    color: "bg-emerald-50 text-emerald-600",
    description: "Automated unit and edge-case testing.",
    examples: [
      "Writing Jest/Vitest suites for React components.",
      "Simulating edge cases for robust data handling.",
      "Mocking external API dependencies for isolation."
    ]
  },
  {
    name: "Git Master",
    id: "git-master",
    icon: <TerminalSquare className="w-5 h-5" />,
    color: "bg-slate-50 text-slate-600",
    description: "Expert version control and conflict resolution.",
    examples: [
      "Resolving complex git rebase conflicts.",
      "Managing production vs feature branch flows.",
      "Troubleshooting broken repository states."
    ]
  },
  {
    name: "Regex Crafter",
    id: "regex-crafter",
    icon: <TerminalSquare className="w-5 h-5" />,
    color: "bg-red-50 text-red-600",
    description: "Precision string extraction and validation patterns.",
    examples: [
      "Designing complex email or phone validators.",
      "Structuring log parsing patterns.",
      "Optimizing regex for performance."
    ]
  },
  {
    name: "State Strategist",
    id: "state-management-strategist",
    icon: <Boxes className="w-5 h-5" />,
    color: "bg-purple-50 text-purple-600",
    description: "Architecting global vs local data flow.",
    examples: [
      "Setting up Redux/Pinia/Zustand stores.",
      "Mapping data origin and mutation paths.",
      "Eliminating prop drilling in complex apps."
    ]
  },
  {
    name: "DevOps Engineer",
    id: "devops-deployment-engineer",
    icon: <Cloud className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600",
    description: "Infrastructure mapping and CI/CD pipelines.",
    examples: [
      "Containerizing apps with Docker multi-stage builds.",
      "Automating deployments via GitHub Actions.",
      "Configuring optimized production start commands."
    ]
  },
  {
    name: "Clean Coder",
    id: "clean-coder",
    icon: <Wrench className="w-5 h-5" />,
    color: "bg-teal-50 text-teal-600",
    description: "Advanced structural engineering and high-fidelity architectural synthesis.",
    examples: [
      "Refactoring chaotic logic into modular systems.",
      "Applying SOLID principles to systemic debt.",
      "Optimizing cognitive load and functional purity."
    ]
  },
  {
    name: "Perf Profiler",
    id: "performance-profiler",
    icon: <Cpu className="w-5 h-5" />,
    color: "bg-orange-50 text-orange-600",
    description: "Lighthouse optimization and Core Web Vitals.",
    examples: [
      "Implementing component lazy loading.",
      "Optimizing parallel API data fetching.",
      "Memoizing expensive calculations."
    ]
  },
  {
    name: "UX Polisher",
    id: "ui-ux-polisher",
    icon: <Fingerprint className="w-5 h-5" />,
    color: "bg-pink-50 text-pink-600",
    description: "Micro-interactions and visual hierarchy refinement.",
    examples: [
      "Adding smooth Framer Motion transitions.",
      "Refining whitespace and typography rhythm.",
      "Enhancing hover and focus state feedback."
    ]
  },
  {
    name: "A11y Auditor",
    id: "a11y-accessibility-auditor",
    icon: <Wrench className="w-5 h-5" />,
    color: "bg-gray-50 text-gray-600",
    description: "WCAG compliance and screen reader accessibility.",
    examples: [
      "Auditing keyboard navigation paths.",
      "Implementing semantic ARIA labels and roles.",
      "Refining color contrast for accessibility."
    ]
  },
  {
    name: "SecOps Engineer",
    id: "secops-security-engineer",
    icon: <Fingerprint className="w-5 h-5" />,
    color: "bg-red-50 text-red-600",
    description: "Zero-trust architecture and threat mitigation.",
    examples: [
      "Enforcing strict CORS and CSRF policies.",
      "Securing cookies for sensitive token storage.",
      "Protecting against credential stuffing attacks."
    ]
  },
  {
    name: "Rubber Duck Debugger",
    id: "rubber-duck-debugger",
    icon: <MousePointer2 className="w-5 h-5" />,
    color: "bg-amber-50 text-amber-600",
    description: "Socratic debugging for extreme blockages.",
    examples: [
      "Guiding logic deduction without direct code fix.",
      "Identifying fundamental intent mismatches.",
      "Unblocking developers from complex logic loops."
    ]
  },
  {
    name: "Focus Mode",
    id: "focus-mode",
    icon: <MousePointer2 className="w-5 h-5" />,
    color: "bg-teal-100 text-teal-700",
    description: "Instructions for responding to UI element selection (CSS selectors).",
    examples: [
      "Modifying a specific selected UI element based on CSS selector metadata.",
      "Applying targeted CSS rules to highlighted components.",
      "Ensuring style modifications do not affect unselected global elements."
    ]
  },
  {
    name: "Frontend Design",
    id: "frontend-design",
    icon: <LayoutTemplate className="w-5 h-5" />,
    color: "bg-fuchsia-100 text-fuchsia-700",
    description: "Advanced aesthetic recipes for typography, spacing, and rhythm. Eliminates generic defaults in favor of intentional, custom UI implementations.",
    examples: [
      "Creating a custom, modern landing page with distinctive typography.",
      "Styling a dashboard with intentional white space and cohesive color palettes.",
      "Replacing generic UI components with tailored, aesthetic designs."
    ]
  },
  {
    name: "Gemini API SDK",
    id: "gemini-api",
    icon: <Cpu className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-700",
    description: "Expertise in the modern @google/genai SDK, including multimodal capabilities, structured JSON output, tool calling, and live streaming interactions.",
    examples: [
      "Implementing an AI chatbot that uses tool calling.",
      "Generating structured JSON data from unstructured text inputs.",
      "Integrating live audio-to-audio streaming features."
    ]
  },
  {
    name: "Image Generation",
    id: "image-generation",
    icon: <ImageIcon className="w-5 h-5" />,
    color: "bg-indigo-100 text-indigo-700",
    description: "Generates UI assets, icons, hero banners, and dynamic images at runtime using Gemini models based on deliberate prompt strategies.",
    examples: [
      "Creating custom hero banner images based on user prompts.",
      "Generating unique avatars for user profiles dynamically.",
      "Designing layout placeholder illustrations during prototyping."
    ]
  },
  {
    name: "OAuth Integration",
    id: "oauth-integration",
    icon: <Fingerprint className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-700",
    description: "Handles iframe constraints and redirect limits for third-party Auth providers (e.g. Google, GitHub) inside the AI Studio preview window.",
    examples: [
      "Enabling 'Sign in with Google' within the application.",
      "Integrating GitHub OAuth for fetching user repositories.",
      "Handling cross-origin authentication gracefully in the preview iframe."
    ]
  },
  {
    name: "Real-time & Websockets",
    id: "real-time-and-multi-user",
    icon: <Network className="w-5 h-5" />,
    color: "bg-emerald-100 text-emerald-700",
    description: "Architects multiplayer features, collaborative canvases, and state-synced features using WebSockets and libraries like Konva or Fabric.",
    examples: [
      "Building a live multiplayer game with shared state.",
      "Implementing real-time chat with instant message delivery.",
      "Creating a collaborative whiteboard canvas using Konva."
    ]
  },
  {
    name: "Shadcn UI",
    id: "shadcn-ui",
    icon: <Boxes className="w-5 h-5" />,
    color: "bg-slate-100 text-slate-800",
    description: "Implements accessible, fully customizable Tailwind UI components strictly via CLI setup and component additions when explicitly requested.",
    examples: [
      "Setting up complex data tables with filtering and sorting.",
      "Building accessible, animated dialogs and command menus.",
      "Customizing themes via Tailwind configuration securely."
    ]
  },
  {
    name: "GitHub Migration",
    id: "github-import-migration",
    icon: <TerminalSquare className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-700",
    description: "Adapts and normalizes legacy repositories, package managers, and configuration maps for native compatibility in the cloud environment.",
    examples: [
      "Normalizing Next.js configurations for Cloud Run compatibility.",
      "Refactoring static file serving for imported repositories.",
      "Resolving incorrect port bindings to enforce Port 3000."
    ]
  },
  {
    name: "Cloudflare Hosting",
    id: "cloudflare-hosting",
    icon: <Cloud className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-700",
    description: "Guidelines for deploying websites and application frameworks to Cloudflare Hosting Services (Pages and Workers).",
    examples: [
      "Deploying Next.js and other full-stack frameworks to Cloudflare Pages.",
      "Creating standalone APIs via Cloudflare Workers.",
      "Managing Cloudflare environment variables securely via .env.example."
    ]
  },
  {
    name: "Next.js Framework",
    id: "nextjs-framework",
    icon: <Box className="w-5 h-5" />,
    color: "bg-zinc-100 text-zinc-800",
    description: "Guidelines for building modern React web applications using Next.js App Router.",
    examples: [
      "Building full-stack React applications with Server Components.",
      "Creating API routes using App Router route handlers.",
      "Managing Client vs Server component boundaries for performance."
    ]
  },
  {
    name: "Svelte Framework",
    id: "svelte-framework",
    icon: <LayoutTemplate className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-700",
    description: "Guidelines for building reactive web applications using Svelte 5 and SvelteKit.",
    examples: [
      "Building fast frontends using Svelte 5 runes ($state, $derived).",
      "Managing routes and layouts with SvelteKit.",
      "Loading server data via +page.server.ts."
    ]
  },
  {
    name: "Astro & Qwik Framework",
    id: "astro-qwik-framework",
    icon: <Cpu className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-700",
    description: "Guidelines for building resumable web applications using Astro and Qwik frameworks.",
    examples: [
      "Integrating @qwikdev/astro for highly interactive islands.",
      "Creating resumable Qwik components using component$ and useSignal.",
      "Server-side data fetching directly in Astro frontmatter."
    ]
  },
  {
    name: "Wasp Framework",
    id: "wasp-framework",
    icon: <Network className="w-5 h-5" />,
    color: "bg-yellow-100 text-yellow-700",
    description: "Guidelines for building full-stack web applications using the Wasp framework.",
    examples: [
      "Setting up routing, auth, and database via main.wasp.",
      "Executing sever-side Node.js logic and Prisma database querying.",
      "Integrating React Query natively with generated API queries and actions."
    ]
  },
  {
    name: "Remix Framework",
    id: "remix-framework",
    icon: <LayoutTemplate className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-700",
    description: "Guidelines for building full-stack web applications using the Remix framework.",
    examples: [
      "Creating flat routes and utilizing nested layouts.",
      "Writing robust loaders and actions for server-side endpoints.",
      "Updating the client instantly via useFetcher and `<Form>`."
    ]
  },
  {
    name: "Nuxt Framework",
    id: "nuxt-framework",
    icon: <Box className="w-5 h-5" />,
    color: "bg-emerald-100 text-emerald-700",
    description: "Guidelines for building modern Vue web applications using Nuxt 3+.",
    examples: [
      "Building Vue 3 applications with Server-Side Rendering (SSR).",
      "Using auto-imports for components, composables, and utilities.",
      "Implementing file-based routing and isomorphic data fetching."
    ]
  },
  {
    name: "Hono Framework",
    id: "hono-framework",
    icon: <Network className="w-5 h-5" />,
    color: "bg-red-100 text-red-700",
    description: "Guidelines for building fast, edge-optimized web applications and APIs using the Hono framework.",
    examples: [
      "Creating edge-ready APIs that run on Cloudflare Workers, Node.js, and Bun.",
      "Adding Zod schema validation to endpoints with zValidator.",
      "Building type-safe client fetching using Hono RPC."
    ]
  },
  {
    name: "Laravel Framework",
    id: "laravel-framework",
    icon: <Database className="w-5 h-5" />,
    color: "bg-red-50 text-red-600",
    description: "Guidelines for building robust, full-stack PHP applications using Laravel 11/12/13.",
    examples: [
      "Architecting scalable applications with Eloquent ORM and Migrations.",
      "Building modern SPAs using Laravel Inertia with Vue or React.",
      "Implementing real-time features using Laravel Reverb."
    ]
  },
  {
    name: "MySQL Architect",
    id: "mysql-architect",
    icon: <Database className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-700",
    description: "Advanced schema engineering, query optimization, and high-performance data orchestration.",
    examples: [
      "Designing scalable, ACID-compliant relational systems.",
      "Tuning complex SQL query execution plans.",
      "Implementing high-availability data topologies."
    ]
  },
  {
    name: "Dependency Officer",
    id: "dependency-integrity-officer",
    icon: <Boxes className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-700",
    description: "Advanced package management, dependency resolution, and version collision mitigation.",
    examples: [
      "Fixing complex npm/yarn installation errors.",
      "Resolving pier-dependency version conflicts.",
      "Optimizing dependency trees for production builds."
    ]
  },
  {
    name: "Migration Specialist",
    id: "orm-migration-specialist",
    icon: <Database className="w-5 h-5" />,
    color: "bg-emerald-100 text-emerald-700",
    description: "Advanced database schema evolution, ORM orchestration, and migration engineering.",
    examples: [
      "Designing resilient Prisma/Drizzle schemas.",
      "Resolving database migration drift issues.",
      "Implementing zero-data-loss schema evolutions."
    ]
  },
  {
    name: "Hallucination Shield",
    id: "failure-mode-preemptor",
    icon: <ShieldAlert className="w-5 h-5" />,
    color: "bg-red-100 text-red-700",
    description: "Advanced root-cause isolation and deterministic recovery paths.",
    examples: [
      "Breaking infinite error-fix-error loops.",
      "Surgical stack-trace deconstruction.",
      "Providing deterministic paths out of build failures."
    ]
  },
  {
    name: "Memory Manager",
    id: "technical-memory-manager",
    icon: <BrainCircuit className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-700",
    description: "Technical memory management and project state persistence.",
    examples: [
      "Maintaining CONTEXT.md for state tracking.",
      "Mapping architectural topography.",
      "Preventing contextual drift across long sessions."
    ]
  },
  {
    name: "Auth Architect",
    id: "auth-schema-architect",
    icon: <Fingerprint className="w-5 h-5" />,
    color: "bg-indigo-100 text-indigo-700",
    description: "Advanced authentication data modeling and identity integrity.",
    examples: [
      "Designing secure RBAC user schemas.",
      "Implementing multi-factor data structures.",
      "Ensuring cryptographic identity integrity."
    ]
  },
  {
    name: "JWT Engineer",
    id: "jwt-service-engineer",
    icon: <Fingerprint className="w-5 h-5" />,
    color: "bg-cyan-100 text-cyan-700",
    description: "Advanced stateless session and token lifecycle engineering.",
    examples: [
      "Implementing refresh token rotation.",
      "Hardening JWT claims for authorization.",
      "Asymmetric key exchange setup."
    ]
  },
  {
    name: "API Orchestrator",
    id: "api-route-orchestrator",
    icon: <Network className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-700",
    description: "Advanced endpoint engineering and request lifecycle management.",
    examples: [
      "Designing schema-first REST/GraphQL APIs.",
      "Decoupling business logic from handlers.",
      "Implementing uniform error topographies."
    ]
  },
  {
    name: "Login UI Expo",
    id: "login-ui-specialist",
    icon: <LayoutTemplate className="w-5 h-5" />,
    color: "bg-sky-100 text-sky-700",
    description: "High-conversion authentication interface engineering.",
    examples: [
      "Building accessible, high-performance login flows.",
      "Implementing real-time form validation.",
      "Optimizing password manager integration."
    ]
  },
  {
    name: "Signup UI Expo",
    id: "signup-ui-specialist",
    icon: <LayoutTemplate className="w-5 h-5" />,
    color: "bg-violet-100 text-violet-700",
    description: "Growth-optimized onboarding and registration engineering.",
    examples: [
      "Designing multi-step registration flows.",
      "Implementing verification magic-link bridges.",
      "Optimizing growth-centered onboarding UX."
    ]
  },
  {
    name: "Migration Expert",
    id: "db-migration-expert",
    icon: <Database className="w-5 h-5" />,
    color: "bg-stone-100 text-stone-700",
    description: "Advanced database schema evolution and state-management.",
    examples: [
      "Designing zero-downtime database migrations.",
      "Implementing declarative data seeding.",
      "Schema versioning and rollback logic."
    ]
  },
  {
    name: "Middleware Eng",
    id: "middleware-engineer",
    icon: <Cpu className="w-5 h-5" />,
    color: "bg-slate-100 text-slate-700",
    description: "Advanced request interception and context orchestration.",
    examples: [
      "Building defensive security header guards.",
      "Injecting multi-tenant routing context.",
      "Orchestrating global logging pipelines."
    ]
  },
  {
    name: "Traffic Control",
    id: "rate-limiting-officer",
    icon: <ShieldAlert className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-700",
    description: "Advanced traffic control and resource protection.",
    examples: [
      "Designing sliding-window rate limiters.",
      "Implementing distributed state throttling.",
      "Neutralizing Denial of Wallet attacks."
    ]
  },
  {
    name: "QA Specialist",
    id: "qa-test-specialist",
    icon: <TerminalSquare className="w-5 h-5" />,
    color: "bg-lime-100 text-lime-700",
    description: "Advanced quality assurance and systemic reliability.",
    examples: [
      "Building E2E Playwright regression flows.",
      "Implementing hermetic database mocking.",
      "Tracing user stories to automated tests."
    ]
  },
  {
    name: "Agents SDK",
    id: "cloudflare-agents-sdk",
    icon: <BrainCircuit className="w-5 h-5" />,
    color: "bg-orange-50 text-orange-600",
    description: "Building stateful AI agents with Durable Objects and real-time connectivity.",
    examples: [
      "Defining stateful Agent classes on Cloudflare.",
      "Managing persistent state with storage.put and storage.get.",
      "Implementing real-time WebSockets and Alarms."
    ]
  },
  {
    name: "Composition Patterns",
    id: "react-composition-patterns",
    icon: <Layers className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600",
    description: "Advanced React architectures using slots, compounds, and modular design.",
    examples: [
      "Implementing Compound Component patterns.",
      "Using Slots for complex, flexible layouts.",
      "Managing global vs scoped context state."
    ]
  },
  {
    name: "ADR Specialist",
    id: "vercel-adr-skill",
    icon: <FileText className="w-5 h-5" />,
    color: "bg-fuchsia-50 text-fuchsia-600",
    description: "Create and maintain Architecture Decision Records (ADRs) optimized for agentic coding workflows.",
    examples: [
      "Proposing a new architectural pattern or dependency.",
      "Bootstrapping an ADR directory and index.",
      "Documenting codebase architectural decisions."
    ]
  }
];
