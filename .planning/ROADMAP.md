# ROADMAP.md - Claw2Human

## Phase 1: Research & Specification ✅
**Status:** Complete
**Duration:** 1 day

### Deliverables
- [x] Project overview and goals
- [x] Tech stack research with options
- [x] Architecture approaches documented
- [x] Database schema options
- [x] API design options
- [x] GSD project structure

### Key Decisions Needed (from user)
- Backend framework (Hono/Fastify/Express)
- Database (Postgres/MongoDB/Supabase)
- Frontend (Next.js/React SPA/Nuxt)
- Auth provider (Clerk/Auth.js/Supabase)
- Hosting strategy
- MVP scope

---

## Phase 2: Foundation ⏳
**Status:** Blocked - awaiting user decisions
**Duration:** 1 week
**Dependencies:** Phase 1 decisions

### Milestones

#### M2.1: Project Bootstrap
- Initialize monorepo with chosen stack
- Set up Docker Compose (DB, cache, storage)
- Configure CI/CD pipeline
- Set up linting, formatting, type checking

#### M2.2: Database Layer
- Create database schema based on chosen DB
- Run initial migrations
- Set up seed data
- Configure connection pooling

#### M2.3: Backend Skeleton
- Hello world API endpoint
- Health check endpoint
- Error handling middleware
- Request logging

#### M2.4: Frontend Shell
- Landing page shell
- Authentication integration (chosen provider)
- Dashboard layout
- Mobile navigation

#### M2.5: Development Environment
- Hot reload working
- Database GUI (pgAdmin/Prisma Studio)
- API testing setup (Insomnia/Postman)
- Documentation stub

---

## Phase 3: Core API ⏳
**Status:** Pending
**Duration:** 2 weeks

### Milestones

#### M3.1: Template API
- POST /templates - create template
- GET /templates/:id - get template
- PATCH /templates/:id - update template
- GET /templates - list templates

#### M3.2: Object API
- POST /objects - create object
- GET /objects/:id - get object with history
- GET /objects/:id/status - quick status
- PATCH /objects/:id - edit object

#### M3.3: Folder API
- POST /folders - create folder
- GET /folders/:id/children - list contents
- GET /folders/tree - get folder tree
- PATCH /folders/:id/move - move folder

#### M3.4: Review Actions API
- POST /objects/:id/approve
- POST /objects/:id/reject
- POST /objects/:id/request-changes
- GET /objects/:id/actions - action history

#### M3.5: Comments API
- POST /objects/:id/comments
- GET /objects/:id/comments
- DELETE /comments/:id

---

## Phase 4: Review Interface ⏳
**Status:** Pending
**Duration:** 2 weeks

### Milestones

#### M4.1: Dashboard
- Workspace selector
- Folder tree navigation
- Template list view
- Object list view with filters

#### M4.2: Template Builder (basic)
- Create template form
- Field type selector
- Action configuration
- Preview mode

#### M4.3: Object Viewer
- Render object fields by type
- Markdown rendering
- File attachments display
- Version selector

#### M4.4: Action Bar
- Action buttons (approve/reject/request changes)
- Comment input
- Confirmation modals
- Success/error feedback

#### M4.5: Mobile Polish
- Touch-friendly buttons
- Swipe gestures
- Bottom sheet for actions
- Responsive typography

---

## Phase 5: Webhook System ⏳
**Status:** Pending
**Duration:** 1 week

### Milestones

#### M5.1: Webhook Registration
- POST /webhooks - register webhook
- GET /webhooks - list webhooks
- DELETE /webhooks/:id
- Webhook secret generation

#### M5.2: Event Delivery
- Queue events on object action
- HTTP POST to webhook URL
- Retry with exponential backoff
- Delivery status tracking

#### M5.3: Security
- HMAC signature generation
- Signature verification helper
- Timestamp validation
- IP allowlist (optional)

#### M5.4: Monitoring
- Webhook delivery logs
- Failed delivery alerting
- Retry queue dashboard
- Webhook test endpoint

---

## Phase 6: Polish & Launch ⏳
**Status:** Pending
**Duration:** 1 week

### Milestones

#### M6.1: Testing
- Unit tests for services
- API integration tests
- E2E tests for critical paths
- Mobile testing on real devices

#### M6.2: Documentation
- API documentation (Scalar/OpenAPI)
- Integration guide for agents
- Self-hosting guide
- Video walkthrough

#### M6.3: Performance
- Database query optimization
- Frontend bundle size audit
- Image optimization
- CDN setup

#### M6.4: Launch Prep
- Production environment
- Monitoring (errors, performance)
- Backup strategy
- Support channel setup

---

## Future Phases (Post-MVP)

### Phase 7: Advanced Features
- Real-time collaboration (WebSockets)
- Custom field types (plugins)
- Workflow automation
- Analytics dashboard

### Phase 8: Enterprise
- SAML/SSO
- Audit logs
- Advanced permissions
- Custom branding

### Phase 9: Ecosystem
- Public template marketplace
- Agent SDKs (Python, Go, JS)
- Zapier/Make integration
- Mobile apps (iOS/Android)

---

## Timeline Summary

| Phase | Duration | Cumulative |
|-------|----------|------------|
| 1. Research | 1 day | Day 1 ✅ |
| 2. Foundation | 1 week | Week 2 |
| 3. Core API | 2 weeks | Week 4 |
| 4. Review UI | 2 weeks | Week 6 |
| 5. Webhooks | 1 week | Week 7 |
| 6. Launch | 1 week | Week 8 |

**Total MVP Timeline: 8 weeks**

*Note: Timeline assumes 2 developers, standard MVP scope. Adjust based on decisions.*
