# Claw2Human - Decisions Needed from El Jovenzuelo

## Project: claw2human
**Goal:** Bridge system for Agent-to-Human communication

---

## Decision 1: Backend Framework

**Context:** API server for agents to create templates/objects, humans to review

| Option | Pros | Cons | My Take |
|--------|------|------|---------|
| **A. Hono.js** | Fast, lightweight, edge-ready, Bun-native | Smaller community | ⭐ Modern choice |
| **B. Fastify** | Mature, fast, great plugins | Heavier, more boilerplate | Safe enterprise choice |
| **C. Express** | Everyone knows it, huge ecosystem | Aging, slower | Boring but reliable |

**Question:** Which backend framework should we use?
- [ ] Hono.js (modern, fast)
- [ ] Fastify (mature, performant)
- [ ] Express (familiar, stable)

---

## Decision 2: Database

**Context:** Store templates, objects, folders, actions, comments. Need hierarchy (folders) + flexible schemas (template fields).

| Option | Pros | Cons | My Take |
|--------|------|------|---------|
| **A. PostgreSQL (Neon)** | Relational + JSONB, LTREE for folders, serverless | Need migrations | ⭐ Best balance |
| **B. MongoDB** | Native documents, flexible | No ACID, harder hierarchy | Good for schemas |
| **C. Supabase Postgres** | Auth included, RLS, realtime | Vendor lock-in | All-in-one |

**Question:** Which database?
- [ ] PostgreSQL (Neon) - separate from auth
- [ ] MongoDB Atlas - pure document store
- [ ] Supabase - Postgres + auth together

---

## Decision 3: Frontend Approach

**Context:** Mobile-friendly review interface, dashboard for templates/folders

| Option | Pros | Cons | My Take |
|--------|------|------|---------|
| **A. Next.js 15** | Full-stack, SSR, API routes | Complex App Router | ⭐ Industry standard |
| **B. React SPA (Vite)** | Fast, simple, smaller bundle | No SSR, separate API | Good for dashboards |
| **C. Nuxt 3 (Vue)** | Great DX, fast | Vue ecosystem smaller | If you prefer Vue |

**Question:** Frontend stack?
- [ ] Next.js 15 (React, full-stack)
- [ ] React SPA + Vite (separate API project)
- [ ] Nuxt 3 (Vue)

---

## Decision 4: Authentication

**Context:** Two user types - AI agents (API keys) and humans (UI login)

| Option | Pros | Cons | My Take |
|--------|------|------|---------|
| **A. Clerk** | Beautiful UI components, orgs, webhooks | Per-user cost scales | ⭐ Fastest to implement |
| **B. Auth.js (NextAuth)** | Open source, bring your own DB | More setup, less polished | Cost-effective |
| **C. Supabase Auth** | Integrated with DB, RLS | Less frontend polish | If using Supabase |

**Question:** Authentication provider?
- [ ] Clerk - premium UX, fastest setup
- [ ] Auth.js - open source, custom control
- [ ] Supabase Auth - integrated with DB

---

## Decision 5: Real-time Updates

**Context:** When human approves/rejects, agent should get notified quickly

| Option | Pros | Cons | My Take |
|--------|------|------|---------|
| **A. Webhooks (HTTP callbacks)** | Simple, reliable, agent polls if needed | Not true real-time | ⭐ MVP approach |
| **B. Server-Sent Events** | One-way real-time, HTTP-based | One-direction only | Good for notifications |
| **C. WebSockets** | Bidirectional, lowest latency | Harder to scale | Overkill for MVP? |

**Question:** Real-time strategy?
- [ ] Webhooks only (MVP, simpler)
- [ ] Webhooks + SSE (live notifications)
- [ ] WebSockets (full real-time)

---

## Decision 6: File Storage

**Context:** Agents might attach files to objects (images, PDFs)

| Option | Pros | Cons | My Take |
|--------|------|------|---------|
| **A. MinIO (Docker)** | Self-hosted, no egress fees, local dev | Ops burden | ⭐ Dev-friendly |
| **B. Cloudflare R2** | Zero egress, edge CDN | Vendor dependency | Best for production |
| **C. Skip for now** | Simpler MVP | No file support | Maybe later? |

**Question:** File storage?
- [ ] MinIO in Docker (dev now, self-host later)
- [ ] Cloudflare R2 (production-ready)
- [ ] Skip files for MVP

---

## Decision 7: Hosting Strategy

| Option | Pros | Cons | My Take |
|--------|------|------|---------|
| **A. Railway + Vercel** | Easy, git-based, generous free tier | Costs at scale | ⭐ Fastest deploy |
| **B. Fly.io** | Global edge, good for WebSockets | Learning curve | Best for distribution |
| **C. Self-hosted (Hetzner)** | Cheapest long-term | All ops on you | Cost optimization |

**Question:** Hosting?
- [ ] Railway (backend) + Vercel (frontend)
- [ ] Fly.io (both)
- [ ] Self-hosted (later phase)

---

## Decision 8: MVP Scope

**What's IN for first version?**

| Feature | Priority | Notes |
|---------|----------|-------|
| Template creation (API) | Must have | Agent defines fields + actions |
| Object creation (API) | Must have | Agent creates instance from template |
| Review UI | Must have | Human views + takes actions |
| Webhook delivery | Must have | Notify agent of human actions |
| Folder hierarchy | Should have | Organize templates/objects |
| Comments | Should have | Human can comment on objects |
| Version history | Nice to have | Track object revisions |
| File attachments | Nice to have | Upload files to objects |
| Real-time notifications | Nice to have | Live updates without refresh |
| Multi-workspace | Later | Teams/orgs isolation |

**Question:** What's the MINIMUM for MVP?
- [ ] Super minimal (templates + objects + basic review + webhooks)
- [ ] Standard MVP (add folders + comments)
- [ ] Feature-rich MVP (add versions + files)

---

## My Recommendations (if you want defaults)

If you want to move fast and decide later, I'd suggest:

1. **Backend:** Hono.js (modern, fast, Bun-native)
2. **Database:** PostgreSQL via Neon (JSONB flexibility + LTREE)
3. **Frontend:** Next.js 15 (full-stack, Vercel-ready)
4. **Auth:** Clerk (fastest implementation, great UX)
5. **Real-time:** Webhooks + SSE (balanced approach)
6. **Storage:** MinIO in Docker (easy dev, migrate later)
7. **Hosting:** Railway + Vercel (fastest deploy)
8. **MVP Scope:** Standard (folders + comments included)

**But I need YOUR decisions to proceed!**

---

## Timeline Estimate

Based on scope:

| Scope | Timeline | Team Size |
|-------|----------|-----------|
| Super minimal MVP | 2-3 weeks | 1-2 devs |
| Standard MVP | 4-6 weeks | 2 devs |
| Feature-rich MVP | 6-8 weeks | 2-3 devs |

---

**Ready for your decisions!** 🎯
