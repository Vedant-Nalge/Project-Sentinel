# Project Sentinel - Autonomous Incident Resolution Engine

An AI-powered DevOps monitoring dashboard that connects to a mock production environment, detects failures, and spawns Claude subagents to autonomously write, test, and commit fixes.

## 🎯 The Goal

Build a dashboard that demonstrates the "Mastery" of Claude Code - leading AI agents to autonomously fix production issues without human intervention.

## 🏗️ Architecture

```
/
├── app/                    # Next.js 14 dashboard (App Router)
│   ├── src/
│   │   ├── app/           # Next.js pages & components
│   │   └── lib/           # Database utilities
│   ├── package.json
│   └── tailwind.config.js
├── services/               # Node.js microservices
│   ├── auth-service/      # Authentication (port 3001)
│   ├── payment-service/   # Payment processing (port 3002)
│   ├── inventory-service/ # Product inventory (port 3003)
│   └── notification-service/ # Push notifications (port 3004)
├── scripts/               # Automation scripts
│   ├── chaos-monkey.js    # Random bug injection
│   ├── check-status.js   # Service health polling
│   └── generate-postmortem.js  # Incident analysis
├── docs/
│   └── incident-history.log  # Resolutions log
├── CLAUDE.md             # Resolution Protocol & conventions
└── package.json          # Workspace root
```

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dashboard
```bash
npm run dev
# Opens at http://localhost:3000
```

### 3. Inject a bug (run Chaos Monkey)
```bash
npm run chaos
# Randomly breaks one of the 4 services
```

### 4. Check service status
```bash
npm run status
# Shows health of all services
```

### 5. Generate post-mortem
```bash
npm run postmortem
# Shows incident analysis
```

## 🎮 The Autonomous Resolution Workflow

### Step 1: Chaos Monkey injects a bug
```bash
node scripts/chaos-monkey.js
```

### Step 2: MCP detects CRITICAL status
The status check script polls each service and updates the database.

### Step 3: Spawn Subagent Alpha (Debugger)
```
Sentinel Agent, identify why Service X is failing.
Access the /services/logs, find the error, and implement a fix.
```

### Step 4: Spawn Subagent Beta (QA)
Writes a regression test to ensure the bug never returns.

### Step 5: Main Agent commits the fix
```bash
git commit -m "fix: resolve type mismatch in auth-service"
```

### Step 6: Dashboard shows RESOLVED
The incident is marked as resolved with the fix commit hash.

## 📋 Resolution Protocol

Before applying ANY fix, Claude MUST:

1. **Check Incident History**: Read `/docs/incident-history.log`
   - If bug failed before, use Thinking Mode for alternative approach

2. **Diagnosis Phase**:
   - Read service logs in `/services/*/logs/`
   - Identify root cause (syntax, type, logic, dependency, config)

3. **Fix Implementation**:
   - Apply minimal fix - never rewrite entire files
   - Follow CLAUDE.md naming conventions

4. **Verification**:
   - Run `npm test`
   - Log resolution in incident-history.log

## 🔧 MCP Integration

The dashboard uses a JSON-based "MCP" for status tracking:
- Database: `/app/data/sentinel-state.json`
- Tables: services, incidents, resolutions

## 🤖 Multi-Agent Orchestration

| Agent | Role |
|-------|------|
| Main Agent | Dashboard UI, coordinates subagents |
| Subagent Alpha | Debugger - traces errors, proposes fixes |
| Subagent Beta | QA - writes regression tests |

## 📊 Dashboard Features

- **System Health**: Percentage of healthy services
- **Active Incidents**: Currently failing services
- **Resolved by Claude**: Fixes committed autonomously
- **Service Status**: Real-time health of each microservice

## 🎬 Demo

1. Run `npm run chaos` to inject a bug
2. Use the dashboard to see the incident
3. Command Claude to diagnose and fix
4. Watch autonomous resolution in action
5. Run `npm run postmortem` for analysis

## 📦 Submission

1. **GitHub Repo**: Contains all code + CLAUDE.md
2. **Agent Logs**: `docs/incident-history.log` - shows complex resolution session
3. **Loom Video**: 3-minute demo showing:
   - Running Chaos Monkey
   - Not touching keyboard
   - Verbally directing Claude to diagnose, fix, test, deploy

---

**Remember**: Manual coding is considered a "failure" in this project. The goal is to demonstrate your ability to *lead* AI, not to *be* the AI.