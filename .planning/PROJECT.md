# PROJECT.md - Claw2Human (C2H)

## Overview
Bridge system for Agent-to-Human communication. AI agents create reviewable content using templates; humans review, approve, and provide feedback via mobile-friendly interface.

## Problem Statement
- Agents generate content but can't get human approval easily
- No structured workflow for agent-to-human handoff
- Humans need mobile-friendly way to review AI output
- Need bidirectional feedback loop (human actions → agent notification)

## Solution
Template-driven review platform:
1. Agent creates template (fields + actions)
2. Agent creates object from template
3. Human reviews via mobile web
4. Human takes action (approve/reject/comment)
5. Webhook notifies agent
6. Agent continues workflow

## Target Users
- **Primary:** AI agents (OpenClaw, Claude Code, etc.)
- **Secondary:** Humans reviewing agent output

## Success Metrics
- Agent can create template via API
- Human can approve object in < 30 seconds
- Webhook delivery success > 99%
- Mobile page load < 2s

## Constraints
- Must work on mobile
- Must have webhook callbacks
- Must support folder hierarchy
- Must version objects

## Tech Stack (TBD - see DECISIONS.md)
Awaiting user decisions on:
- Backend framework
- Database
- Frontend approach
- Auth provider
- Hosting

## Links
- GitHub: https://github.com/ddikddak/claw2human
- PRD: ./PRD.md
- Research: ./research/
- Decisions: ./DECISIONS.md
