# Claw2Human (C2H)

> A bridge system for Agent-to-Human communication

[![GitHub](https://img.shields.io/badge/GitHub-ddikddak%2Fclaw2human-blue)](https://github.com/ddikddak/claw2human)

## Overview

Claw2Human (C2H) enables seamless communication between AI agents and humans through a structured review platform. Agents create content using templates, and humans review, approve, and provide feedback via an intuitive mobile-friendly interface.

## Key Features

- **📋 Template-Driven**: Create reusable templates with custom fields and actions
- **👥 Human Review**: Mobile-optimized interface for approval workflows
- **🔄 Real-time Feedback**: Webhook events notify agents of human actions
- **📁 Drive-like Organization**: Hierarchical folder structure with versioning
- **🔔 Multi-Channel**: Support for document review, blog workflows, to-do lists, and more

## Use Cases

1. **Document Review** - Approve/Reject/Comment on AI-generated documents
2. **Blog Post Workflow** - Multi-stage approval before publishing
3. **Interactive To-Do** - Real-time task management with agent notifications
4. **Template Approval** - Human validation of agent-created templates
5. **Version Tracking** - Full history from v1 to vN

## Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Agent API  │◄────►│  C2H Server  │◄────►│  Web Client  │
│  (OpenClaw)  │      │   (Hono.js)  │      │  (Next.js)   │
└──────────────┘      └──────┬───────┘      └──────────────┘
                             │
                    ┌────────▼────────┐
                    │  PostgreSQL     │
                    │  (Neon) + Redis │
                    └─────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Bun + Hono.js + Drizzle ORM |
| Frontend | Next.js 15 + React 19 + Tailwind CSS |
| Database | PostgreSQL (Neon) + Redis |
| Auth | Clerk |
| Storage | MinIO (S3-compatible) |

## Project Structure

```
claw2human/
├── apps/
│   ├── backend/          # Hono.js API
│   └── frontend/         # Next.js web app
├── packages/
│   └── shared/           # Shared types & utilities
└── docs/                 # Documentation
```

## Quick Start

```bash
# Clone the repo
git clone https://github.com/ddikddak/claw2human.git
cd claw2human

# Install dependencies
npm install

# Start development environment
docker-compose up -d

# Run migrations
cd apps/backend && bun run db:migrate

# Start backend
cd apps/backend && bun run dev

# Start frontend (new terminal)
cd apps/frontend && npm run dev
```

## API Example

**Create an object for review:**
```bash
curl -X POST https://api.c2h.io/v1/objects \
  -H "Authorization: Bearer $C2H_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "tpl_blog_post",
    "data": {
      "title": "The Future of AI",
      "content": "...",
      "tags": ["ai", "future"]
    }
  }'
```

**Response:**
```json
{
  "id": "obj_abc123",
  "status": "pending",
  "review_url": "https://c2h.io/w/acme/review/obj_abc123"
}
```

## Documentation

- [Product Requirements Document](./.planning/PRD.md)
- [API Documentation](https://docs.c2h.io)
- [Deployment Guide](./docs/deployment/README.md)

## Status

**Phase 1: Research & Specification** ✅ Complete

- [x] Architecture design
- [x] Database schema
- [x] API specification
- [x] Tech stack selection

**Phase 2: Foundation** 🔄 In Progress

- [ ] Monorepo setup
- [ ] Backend foundation
- [ ] Frontend foundation
- [ ] Authentication

## License

MIT License - see [LICENSE](./LICENSE) for details

---

Built with ❤️ for seamless Agent-to-Human collaboration
