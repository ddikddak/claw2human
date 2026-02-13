# Claw2Human - Architecture & Stack Proposal

## Executive Summary

Based on research of modern web development stacks for Agent-to-Human communication platforms, I propose a **modern, performance-focused stack** optimized for:
- Fast API responses for agent integration
- Mobile-first human review experience
- Real-time webhook delivery
- Type safety throughout the stack

---

## 🏗️ Proposed Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLAW2HUMAN PLATFORM                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐   │
│   │   Agents     │◄───────►│   Hono API   │◄───────►│  Next.js UI  │   │
│   │  (API Keys)  │  REST   │   (Bun)      │  REST   │  (Clerk)     │   │
│   └──────────────┘         └──────┬───────┘         └──────────────┘   │
│                                    │                                    │
│                          ┌─────────▼──────────┐                        │
│                          │   Neon Postgres    │                        │
│                          │   + Drizzle ORM    │                        │
│                          └─────────┬──────────┘                        │
│                                    │                                    │
│                    ┌───────────────┼───────────────┐                    │
│                    │               │               │                    │
│            ┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐            │
│            │   Webhook    │ │    Redis    │ │   MinIO     │            │
│            │    Queue     │ │   (Cache)   │ │  (Files)    │            │
│            └──────────────┘ └─────────────┘ └─────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Proposed Tech Stack

### Backend: Hono.js + Bun

**Why Hono instead of Express or Fastify:**
- **Speed:** 2-3x faster than Express, comparable to Fastify
- **Size:** 20KB vs Fastify's 150KB+ dependencies
- **Edge-ready:** Works on Cloudflare Workers, Deno, Bun, Node
- **TypeScript:** Native TS support without hacks
- **Middleware:** Growing ecosystem, OpenAPI integration

```typescript
// Example: Clean, type-safe API with Hono
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

app.post('/objects', 
  zValidator('json', createObjectSchema),
  async (c) => {
    const data = c.req.valid('json')
    const object = await objectService.create(data)
    return c.json({ id: object.id, reviewUrl: object.reviewUrl })
  }
)
```

### Database: PostgreSQL (Neon) + Drizzle ORM

**Why PostgreSQL over MongoDB:**
- **LTREE extension:** Native hierarchical queries for folders (`path <@ 'root.folder'`)
- **JSONB:** Flexible schema for template fields while keeping relational integrity
- **ACID:** Transaction safety for webhook deliveries
- **Neon:** Serverless Postgres with generous free tier, scales to zero

**Schema highlights:**
```sql
-- Hierarchical folders with LTREE
CREATE TABLE folders (
  id UUID PRIMARY KEY,
  path LTREE NOT NULL  -- 'root.folder.subfolder'
);
CREATE INDEX idx_folders_path ON folders USING GIST(path);

-- Flexible objects with JSONB
CREATE TABLE objects (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES templates(id),
  data JSONB NOT NULL,  -- { title: "...", content: "..." }
  status TEXT DEFAULT 'pending'
);
```

### Frontend: Next.js 15 (App Router)

**Why Next.js over React SPA:**
- **Full-stack:** API routes for webhooks in same project
- **SSR:** Better SEO for public review links
- **React 19:** Latest features, Server Components
- **Vercel:** One-click deploy, edge distribution

**Key pages:**
- `/w/[workspace]/review/[objectId]` - Mobile review interface
- `/w/[workspace]/dashboard` - Template/folder management
- `/api/webhooks/[workspace]` - Incoming webhook handlers

### Authentication: Clerk

**Why Clerk over Auth.js or Supabase:**
- **Speed:** Pre-built UI components, zero design time
- **Organizations:** Built-in workspace/team support
- **Webhooks:** User events (signup, org create) for provisioning
- **UX:** Beautiful, accessible auth flows

```typescript
// Middleware protects routes
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/api/webhooks(.*)', '/review/(.*)']
})
```

### Real-time: Webhooks + Server-Sent Events

**Strategy:**
- **Webhooks:** Agent → C2H (object created), C2H → Agent (action taken)
- **SSE:** C2H → Browser (live updates when human acts)
- **Why not WebSockets:** Overkill for MVP, harder to scale horizontally

### File Storage: MinIO (Docker locally, R2 in prod)

**Strategy:**
- **Development:** MinIO in Docker (S3-compatible, no cloud deps)
- **Production:** Migrate to Cloudflare R2 (zero egress fees)
- **Why:** Start simple, optimize costs later

### Hosting: Railway (backend) + Vercel (frontend)

**Why this combo:**
- **Railway:** Easy Postgres + Redis + backend deploy
- **Vercel:** Optimal for Next.js, global edge
- **Free tier:** Generous limits for MVP
- **Git-based:** Push to deploy

---

## 📊 Stack Comparison Matrix

| Criteria | Proposed | Alternative A | Alternative B |
|----------|----------|---------------|---------------|
| **Backend** | Hono + Bun | Fastify + Node | Express + Node |
| **Database** | Postgres (Neon) | MongoDB Atlas | Supabase |
| **Frontend** | Next.js 15 | React SPA + Vite | Nuxt 3 |
| **Auth** | Clerk | Auth.js | Supabase Auth |
| **Speed to MVP** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cost (MVP)** | Free tier | Free tier | Free tier |
| **Team familiarity** | Modern | Common | Vue |

---

## 🎯 MVP Scope Recommendation

### Phase 1: Foundation (Week 1-2)
- Project setup with chosen stack
- Database schema + migrations
- Auth integration (Clerk)
- Hello world API + UI

### Phase 2: Core API (Week 3-4)
- Template CRUD
- Object CRUD
- Folder hierarchy
- Basic review endpoints

### Phase 3: Review UI (Week 5-6)
- Object viewer (mobile-first)
- Action buttons (approve/reject/request changes)
- Comment system
- Dashboard for templates/folders

### Phase 4: Webhooks (Week 7)
- Webhook registration
- Event delivery queue
- Retry logic
- Delivery logs

### Phase 5: Polish & Deploy (Week 8)
- Mobile testing
- API documentation
- Production deploy
- Monitoring

**Total: 8 weeks for standard MVP**

---

## ❓ Open Questions for You

Before I proceed with Phase 2 implementation:

1. **Backend:** Confirm Hono.js, or prefer Fastify/Express?
2. **Database:** Confirm PostgreSQL (Neon), or prefer MongoDB?
3. **Frontend:** Confirm Next.js, or prefer React SPA?
4. **Auth:** Confirm Clerk, or prefer Auth.js/Supabase?
5. **Scope:** Standard MVP (8 weeks) or trim features?

---

## 🚀 Ready to Build

Once you confirm the stack, I'll immediately start Phase 2:
1. Initialize monorepo with Turbo
2. Set up Docker Compose (Postgres, Redis, MinIO)
3. Bootstrap Hono backend with Drizzle
4. Bootstrap Next.js frontend with Clerk
5. Connect everything

**GitHub:** https://github.com/ddikddak/claw2human  
**Project:** `~/workspace/projects/claw2human/`

Waiting for your go! 🎯
