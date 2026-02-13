# Claw2Human (C2H) - Product Requirements Document

## Project Overview

**Claw2Human (C2H)** is a bridge system enabling seamless Agent-to-Human communication. It provides a structured platform where AI agents can create reviewable content using templates, and humans can review, approve, request changes, and provide feedback through an intuitive mobile-friendly interface.

---

## Goals & Objectives

1. **Template-Driven Content Creation**: Agents create reusable templates with defined fields and actions
2. **Structured Review Workflow**: Human-friendly interface for reviewing agent-generated content
3. **Bidirectional Communication**: Actions trigger webhooks/events back to agents
4. **Drive-like Organization**: Folder-based storage with versioning support
5. **Mobile-First Experience**: Optimized for on-the-go human review

---

## Key Use Cases

| # | Use Case | Description |
|---|----------|-------------|
| 1 | Document Review | Approve/Reject/Comment on documents created by agents |
| 2 | Blog Post Workflow | Approve and publish content through multi-stage review |
| 3 | Interactive To-Do List | Real-time task toggling with agent notification |
| 4 | Template Approval | Agent creates templates → Human approves for use |
| 5 | Multi-Version Review | Track v1 → v2 → v3 with full history |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLAW2HUMAN PLATFORM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────┐  │
│  │   OpenClaw      │         │   Web Client    │         │  Webhooks   │  │
│  │   Agent API     │◄───────►│   (Next.js)     │◄───────►│  (Events)   │  │
│  │                 │         │                 │         │             │  │
│  │ • Create Obj    │         │ • Review UI     │         │ • Approval  │  │
│  │ • Read Status   │         │ • Actions       │         │ • Changes   │  │
│  │ • Webhook recv  │         │ • Comments      │         │ • Comments  │  │
│  └────────┬────────┘         └────────┬────────┘         └──────┬──────┘  │
│           │                           │                         │         │
│           └───────────────┬───────────┴─────────────────────────┘         │
│                           │                                               │
│                  ┌────────▼────────┐                                      │
│                  │   API Gateway   │                                      │
│                  │   (Hono.js)     │                                      │
│                  └────────┬────────┘                                      │
│                           │                                               │
│        ┌──────────────────┼──────────────────┐                           │
│        │                  │                  │                           │
│  ┌─────▼─────┐    ┌──────▼──────┐   ┌──────▼──────┐                      │
│  │ Templates │    │  Objects    │   │   Actions   │                      │
│  │  Service  │    │   Service   │   │   Service   │                      │
│  └─────┬─────┘    └──────┬──────┘   └──────┬──────┘                      │
│        │                  │                  │                            │
│        └──────────────────┼──────────────────┘                            │
│                           │                                               │
│                  ┌────────▼────────┐                                      │
│                  │   PostgreSQL    │                                      │
│                  │   (Neon DB)     │                                      │
│                  │   + Drizzle ORM │                                      │
│                  └─────────────────┘                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| **API Layer** | Hono.js + Bun | Fast, type-safe REST API |
| **Frontend** | Next.js 15 + React 19 | Web interface, SSR/SPA hybrid |
| **Database** | PostgreSQL (Neon) | Relational data with JSONB flexibility |
| **ORM** | Drizzle ORM | Type-safe database operations |
| **Realtime** | Server-Sent Events | Live updates for human actions |
| **Storage** | MinIO (S3-compatible) | File attachments |
| **Auth** | Clerk | User authentication |
| **Queue** | BullMQ (Redis) | Background job processing |

---

## Tech Stack Recommendation

### Backend
- **Runtime**: Bun 1.2+
- **Framework**: Hono.js (lightweight, fast, middleware-rich)
- **Language**: TypeScript (strict mode)
- **Validation**: Zod
- **API Documentation**: OpenAPI 3.0 + Scalar UI

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **State**: TanStack Query + Zustand
- **Forms**: React Hook Form + Zod

### Database & Storage
- **Primary DB**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Migrations**: Drizzle Kit
- **File Storage**: MinIO (S3-compatible)
- **Cache/Queue**: Redis (Upstash)

### DevOps & Deployment
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: 
  - Backend: Railway/Fly.io
  - Frontend: Vercel
  - DB: Neon PostgreSQL
- **Monitoring**: OpenTelemetry + SigNoz

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Users       │     │   Workspaces    │     │    Folders      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────┤ id (PK)         │◄────┤ id (PK)         │
│ clerk_id (UQ)   │     │ name            │     │ workspace_id    │
│ email           │     │ slug (UQ)       │     │ parent_id       │
│ name            │     │ owner_id (FK)   │     │ name            │
│ avatar_url      │     │ created_at      │     │ path (LTREE)    │
│ created_at      │     │ updated_at      │     │ created_at      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                          │
                              ┌───────────────────────────┼───────────┐
                              │                           │           │
                    ┌─────────▼────────┐      ┌───────────▼────┐     │
                    │    Templates     │      │    Objects     │     │
                    ├──────────────────┤      ├────────────────┤     │
                    │ id (PK)          │      │ id (PK)        │     │
                    │ workspace_id     │      │ template_id    │─────┘
                    │ folder_id        │──────┤ folder_id      │
                    │ name             │      │ workspace_id   │
                    │ description      │      │ status         │
                    │ field_schema     │      │ version        │
                    │ action_schema    │      │ data (JSONB)   │
                    │ status           │      │ created_by     │
                    │ version          │      │ created_at     │
                    │ created_by       │      │ updated_at     │
                    │ created_at       │      └────────────────┘
                    │ updated_at       │                │
                    └──────────────────┘                │
                                                        │
                              ┌─────────────────────────┼───────────┐
                              │                         │           │
                    ┌─────────▼────────┐     ┌──────────▼────┐     │
                    │  ObjectActions   │     │   Comments    │     │
                    ├──────────────────┤     ├───────────────┤     │
                    │ id (PK)          │     │ id (PK)       │     │
                    │ object_id (FK)   │     │ object_id     │─────┘
                    │ action_type      │     │ user_id       │
                    │ action_data      │     │ content       │
                    │ status           │     │ created_at    │
                    │ performed_by     │     └───────────────┘
                    │ performed_at     │
                    │ webhook_status   │
                    └──────────────────┘
                              │
                              │
                    ┌─────────▼────────┐
                    │    Webhooks      │
                    ├──────────────────┤
                    │ id (PK)          │
                    │ workspace_id     │
                    │ url              │
                    │ events[]         │
                    │ secret           │
                    │ status           │
                    │ created_at       │
                    └──────────────────┘
```

### Schema Details

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### workspaces
```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### folders (LTREE for hierarchical)
```sql
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    path LTREE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_folders_path ON folders USING GIST(path);
CREATE INDEX idx_folders_workspace ON folders(workspace_id);
```

#### templates
```sql
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    field_schema JSONB NOT NULL,  -- Template field definitions
    action_schema JSONB NOT NULL, -- Available actions (approve, reject, etc.)
    status TEXT DEFAULT 'draft',  -- draft, active, archived
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### objects (revisions/instances)
```sql
CREATE TABLE objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, changes_requested
    version INTEGER DEFAULT 1,
    data JSONB NOT NULL,           -- Actual field values
    metadata JSONB DEFAULT '{}',   -- Agent metadata, source, etc.
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_objects_template ON objects(template_id);
CREATE INDEX idx_objects_status ON objects(status);
CREATE INDEX idx_objects_folder ON objects(folder_id);
```

#### object_actions
```sql
CREATE TABLE object_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_id UUID REFERENCES objects(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,     -- approve, reject, request_changes, comment
    action_data JSONB,             -- Additional action context
    comment TEXT,                  -- Human comment
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    webhook_status TEXT DEFAULT 'pending', -- pending, delivered, failed
    webhook_response JSONB
);

CREATE INDEX idx_actions_object ON object_actions(object_id);
CREATE INDEX idx_actions_performed_at ON object_actions(performed_at);
```

#### comments
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_id UUID REFERENCES objects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### webhooks
```sql
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL,        -- ['object.approved', 'object.rejected', etc.]
    secret TEXT NOT NULL,          -- For HMAC signature
    status TEXT DEFAULT 'active',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Endpoints Design

### Authentication
All endpoints require Bearer token authentication via Clerk JWT.

### Agent API (for OpenClaw/AI Agents)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/templates` | Create new template |
| GET | `/api/v1/templates/:id` | Get template by ID |
| PATCH | `/api/v1/templates/:id` | Update template |
| POST | `/api/v1/objects` | Create object from template |
| GET | `/api/v1/objects/:id` | Get object with full history |
| GET | `/api/v1/objects/:id/status` | Quick status check |
| GET | `/api/v1/objects/:id/actions` | Get actions history |
| POST | `/api/v1/webhooks` | Register webhook endpoint |

**Example: Create Object**
```http
POST /api/v1/objects
Content-Type: application/json
Authorization: Bearer {agent_token}

{
  "template_id": "tpl_123",
  "folder_id": "fld_456",
  "data": {
    "title": "Q4 Marketing Report",
    "content": "...markdown content...",
    "priority": "high"
  },
  "metadata": {
    "source": "claude_code",
    "request_id": "req_789"
  }
}
```

**Response:**
```json
{
  "id": "obj_abc123",
  "template_id": "tpl_123",
  "status": "pending",
  "version": 1,
  "data": { ... },
  "review_url": "https://c2h.io/w/acme/review/obj_abc123",
  "created_at": "2026-02-13T11:30:00Z"
}
```

### Human Review API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/workspaces/:slug/review/:objectId` | Get object for review |
| POST | `/api/v1/objects/:id/approve` | Approve object |
| POST | `/api/v1/objects/:id/reject` | Reject object |
| POST | `/api/v1/objects/:id/request-changes` | Request changes |
| POST | `/api/v1/objects/:id/edit` | Edit object data |
| POST | `/api/v1/objects/:id/comments` | Add comment |
| GET | `/api/v1/objects/:id/comments` | List comments |

### Webhook Events

Events sent to registered webhook URLs:

| Event | Description | Payload |
|-------|-------------|---------|
| `object.created` | New object created | object data |
| `object.approved` | Object approved | object + action data |
| `object.rejected` | Object rejected | object + action data |
| `object.changes_requested` | Changes requested | object + comment |
| `object.edited` | Object edited by human | object + changes |
| `object.commented` | New comment added | comment data |
| `template.approved` | Template approved | template data |

**Webhook Payload Example:**
```json
{
  "event": "object.approved",
  "timestamp": "2026-02-13T11:35:00Z",
  "workspace_id": "ws_123",
  "data": {
    "object_id": "obj_abc123",
    "template_id": "tpl_123",
    "action": {
      "type": "approve",
      "performed_by": "user_human123",
      "comment": "Looks good!",
      "performed_at": "2026-02-13T11:35:00Z"
    }
  }
}
```

---

## Folder Structure

```
claw2human/
├── .planning/                  # GSD planning artifacts
│   ├── PROJECT.md
│   ├── REQUIREMENTS.md
│   ├── ROADMAP.md
│   └── STATE.md
│
├── apps/
│   ├── backend/               # Hono.js API server
│   │   ├── src/
│   │   │   ├── index.ts       # Entry point
│   │   │   ├── routes/        # API routes
│   │   │   │   ├── v1/
│   │   │   │   │   ├── templates.ts
│   │   │   │   │   ├── objects.ts
│   │   │   │   │   ├── webhooks.ts
│   │   │   │   │   └── review.ts
│   │   │   ├── services/      # Business logic
│   │   │   │   ├── template.service.ts
│   │   │   │   ├── object.service.ts
│   │   │   │   ├── webhook.service.ts
│   │   │   │   └── folder.service.ts
│   │   │   ├── db/            # Database
│   │   │   │   ├── index.ts   # Drizzle client
│   │   │   │   ├── schema.ts  # Table definitions
│   │   │   │   └── migrations/
│   │   │   ├── middleware/    # Auth, validation
│   │   │   │   ├── auth.ts
│   │   │   │   └── validate.ts
│   │   │   ├── lib/           # Utilities
│   │   │   │   ├── webhook.ts
│   │   │   │   └── errors.ts
│   │   │   └── types/         # TypeScript types
│   │   │       └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── frontend/              # Next.js web app
│       ├── app/               # App Router
│       │   ├── (marketing)/   # Landing, pricing
│       │   ├── (dashboard)/   # Main app
│       │   │   ├── w/
│       │   │   │   └── [slug]/
│       │   │   │       ├── page.tsx           # Dashboard home
│       │   │   │       ├── folders/
│       │   │   │       ├── templates/
│       │   │   │       └── objects/
│       │   │   └── review/
│       │   │       └── [objectId]/
│       │   │           └── page.tsx           # Review page
│       │   ├── api/           # API routes (auth)
│       │   └── layout.tsx
│       ├── components/
│       │   ├── ui/            # shadcn components
│       │   ├── review/        # Review-specific
│       │   │   ├── ObjectViewer.tsx
│       │   │   ├── ActionBar.tsx
│       │   │   ├── CommentThread.tsx
│       │   │   └── VersionHistory.tsx
│       │   ├── folder/
│       │   │   ├── FolderTree.tsx
│       │   │   └── FolderBreadcrumb.tsx
│       │   └── templates/
│       │       ├── TemplateCard.tsx
│       │       └── FieldRenderer.tsx
│       ├── hooks/
│       ├── lib/
│       │   ├── api.ts         # API client
│       │   └── utils.ts
│       ├── stores/            # Zustand stores
│       ├── types/
│       ├── public/
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                # Shared types & utils
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── template.ts
│   │   │   │   ├── object.ts
│   │   │   │   └── api.ts
│   │   │   └── utils/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── eslint-config/         # Shared ESLint config
│
├── docs/                      # Documentation
│   ├── api/
│   ├── deployment/
│   └── development/
│
├── docker-compose.yml
├── turbo.json                 # Turborepo config
├── package.json               # Root package
└── README.md
```

---

## Key Architectural Decisions

### 1. **Template-Driven Architecture**
- Templates define both field schema and available actions
- Objects are instances of templates with actual data
- Supports versioning at both template and object level

### 2. **Flexible Field Schema (JSONB)**
- Template fields defined as JSON schema
- Supports: text, markdown, image, select, checkbox, date
- Agents can define custom field types

### 3. **Hierarchical Folder Structure**
- PostgreSQL LTREE extension for efficient tree queries
- Unlimited nesting depth
- Path-based permissions (future)

### 4. **Webhook-First Event System**
- All human actions trigger webhooks to agents
- Idempotent delivery with retry logic
- HMAC signature for security

### 5. **Agent vs Human Authentication**
- **Agents**: API keys (long-lived, scoped)
- **Humans**: Clerk JWT (session-based, SSO-ready)

### 6. **Real-time Updates**
- Server-Sent Events for live review updates
- Optional WebSocket for future bidirectional features

---

## Phase 2: Next Steps

### Immediate (Week 1)
1. **Project Bootstrap**
   - Initialize TurboRepo monorepo
   - Set up Docker Compose (Postgres, Redis, MinIO)
   - Configure CI/CD pipeline

2. **Backend Foundation**
   - Hono.js + Drizzle setup
   - Database migrations
   - Health check endpoint

3. **Frontend Foundation**
   - Next.js + shadcn/ui setup
   - Clerk authentication integration
   - Basic layout shell

### Short-term (Week 2-3)
1. **Core API Implementation**
   - Template CRUD endpoints
   - Object CRUD endpoints
   - Folder management

2. **Review Interface**
   - Object viewer component
   - Action buttons (approve/reject/request changes)
   - Comment system

3. **Webhook System**
   - Webhook registration
   - Event delivery with retry
   - Signature verification

### Medium-term (Week 4-6)
1. **Polish & Testing**
   - Mobile responsiveness
   - E2E testing with Playwright
   - Performance optimization

2. **Documentation**
   - API documentation (Scalar)
   - Integration guides for agents
   - Deployment guide

---

## Success Metrics

- Agent can create and retrieve templates via API
- Human can review and approve objects via mobile web
- Webhook delivery success rate > 99%
- Page load time < 2s on mobile
- API response time < 200ms (p95)

---

## Appendix

### Field Types Supported

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single-line text | `"Hello World"` |
| `textarea` | Multi-line text | Long descriptions |
| `markdown` | Rich markdown | Blog posts, docs |
| `select` | Single selection | Priority levels |
| `multiselect` | Multiple selection | Tags |
| `checkbox` | Boolean | Approved flag |
| `date` | Date picker | Due date |
| `file` | File attachment | Images, PDFs |
| `array` | List of items | TODO items |

### Action Types

| Type | Description | Triggers Webhook |
|------|-------------|------------------|
| `approve` | Approve the object | Yes |
| `reject` | Reject the object | Yes |
| `request_changes` | Request modifications | Yes |
| `comment` | Add a comment | Yes |
| `edit` | Edit object data | Yes |
| `view` | Mark as viewed | No |

---

*Document Version: 1.0*
*Last Updated: 2026-02-13*
*Author: Claw2Human Lead Developer*
