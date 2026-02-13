# REQUIREMENTS.md - Claw2Human

## Functional Requirements

### FR1: Template Management
- **FR1.1:** Agent can create template with name, description
- **FR1.2:** Template defines field schema (types: text, markdown, select, etc.)
- **FR1.3:** Template defines available actions (approve, reject, request_changes, comment)
- **FR1.4:** Templates are versioned
- **FR1.5:** Templates can be organized in folders

### FR2: Object (Instance) Management
- **FR2.1:** Agent can create object from template
- **FR2.2:** Object contains field values based on template schema
- **FR2.3:** Object has status (pending, approved, rejected, changes_requested)
- **FR2.4:** Object has version number
- **FR2.5:** Object can be edited (creates new version)

### FR3: Review Interface
- **FR3.1:** Human can view object with field values rendered
- **FR3.2:** Human can take actions defined by template
- **FR3.3:** Human can add comments
- **FR3.4:** Interface is mobile-responsive
- **FR3.5:** Interface shows action history

### FR4: Webhook System
- **FR4.1:** Agent can register webhook URL
- **FR4.2:** Webhook receives events (object.approved, object.rejected, etc.)
- **FR4.3:** Webhook payload includes HMAC signature
- **FR4.4:** Failed webhooks are retried with exponential backoff
- **FR4.5:** Webhook delivery status is tracked

### FR5: Folder Organization
- **FR5.1:** Folders can be created in workspace
- **FR5.2:** Folders can be nested (hierarchical)
- **FR5.3:** Templates and objects can be in folders
- **FR5.4:** Folder path is visible in breadcrumb

### FR6: Authentication
- **FR6.1:** Agents authenticate via API keys
- **FR6.2:** Humans authenticate via email/password or OAuth
- **FR6.3:** Workspaces isolate data between users/teams

## Non-Functional Requirements

### NFR1: Performance
- API response time < 200ms (p95)
- Page load time < 2s on mobile 3G
- Webhook delivery < 5s

### NFR2: Reliability
- Webhook delivery success rate > 99%
- Database backups daily
- Uptime SLA 99.9%

### NFR3: Security
- API keys stored hashed
- Webhook signatures verified
- HTTPS only
- Rate limiting on API

### NFR4: Scalability
- Support 1000+ workspaces
- Support 10000+ objects per workspace
- Webhook queue handles spikes

## User Stories

### Agent User Stories
- As an agent, I want to create a template so that I can define reviewable content structure
- As an agent, I want to create an object from a template so that humans can review it
- As an agent, I want to receive webhooks when humans act so that I can continue my workflow
- As an agent, I want to check object status so that I know if it's approved

### Human User Stories
- As a human, I want to see a list of pending reviews so that I know what needs attention
- As a human, I want to approve content with one tap so that I can work quickly on mobile
- As a human, I want to request changes with comments so that I can give feedback
- As a human, I want to see version history so that I know what changed
