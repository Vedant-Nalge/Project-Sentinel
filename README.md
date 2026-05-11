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

## 🛠️ How to Run This Project

### Prerequisites
- Node.js installed
- Git installed
- A GitHub account

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vedant-Nalge/Project-Sentinel.git
   cd Project-Sentinel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dashboard** (Terminal 1)
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser

4. **Inject a bug** (Terminal 2)
   ```bash
   node scripts/chaos-monkey.js
   ```

5. **Tell Claude to fix it**
   Just say: "Enter Plan Mode, then diagnose and fix the broken service"

6. **Watch the magic** - Claude will:
   - Find the bug
   - Fix the code
   - Write regression tests
   - Update the dashboard
   - Commit to GitHub

### Running the Demo for Video

1. Reset everything first: `node scripts/update-state.js`
2. Start dashboard: `npm run dev`
3. Verify all services show HEALTHY
4. Run Chaos Monkey: `node scripts/chaos-monkey.js`
5. Refresh dashboard - one service will show CRITICAL
6. Say to Claude: "Enter Plan Mode, then diagnose and fix the broken service"
7. Watch Claude fix it (don't touch keyboard!)
8. Show the dashboard - now all HEALTHY
9. Push to GitHub: `git push origin main`

---

## 💡 My Learnings

### 1. Finding a Way When Premium AI Models Were Out of Reach
When I first started this project, I quickly realized that Claude Code (the premium version of Claude with all features) wasn't something I could afford as a student. The subscription was way beyond my budget. At first, I felt stuck - how could I build an "AI-powered" project without the best AI tool?

That's when I discovered **MiniMax** - a free AI model that I could use through Claude Code's configuration. It wasn't as powerful as Opus or Sonnet, but it got the job done. I learned that constraints can spark creativity. Instead of waiting for the "perfect" tool, I started building with what I had.

This taught me a valuable lesson: **Don't wait for ideal circumstances. Start with what you have and figure it out as you go.**

### 2. Understanding Claude Code Workflow
Before this project, I had used AI chatbots like ChatGPT and Gemini, but Claude Code was different. It's not just a chatbot you chat with - it's a CLI tool that lives in your terminal and works directly with your codebase.

The workflow I discovered:
- You give commands through the terminal (or verbally in my case for the demo)
- Claude reads your files, understands the project structure
- It can spawn "subagents" to handle different parts of a task
- It can write, edit, and commit code
- It follows rules you define in CLAUDE.md

The key insight was: **Claude Code is a developer tool, not just a chatbot.** You don't just ask questions - you give it tasks to execute.

### 3. Getting Acquainted with Claude Code
The first few days were rough. I didn't know:
- How to set up the project properly
- What commands to use
- How to make Claude follow my project's standards

I spent time reading the documentation, exploring the commands, and most importantly - experimenting. I'd ask Claude to do something small, see how it responded, and gradually understood its capabilities.

**Pro tip:** Create a CLAUDE.md file! It changed everything for me. I added:
- Project architecture details
- Naming conventions (TypeScript rules)
- Resolution Protocol (how to fix bugs)
- Commands reference

Once Claude knew my "company standards," it wrote much better code that actually fit my project.

### 4. Multi-Agent Orchestration is Powerful
Breaking down tasks into subagents (Alpha for debugging, Beta for QA) makes the process more organized. It's like having a real DevOps team.

In my project, when a service went CRITICAL:
- Main Agent coordinated the response
- Subagent Alpha (Debugger) found and fixed the bug
- Subagent Beta (QA) wrote regression tests

This wasn't just cool - it was how real software teams work!

### 5. Documentation is Key
The CLAUDE.md file was crucial. It acted as the "company standards" that the AI followed. Without it, the code quality would have been inconsistent.

### 6. Automation Feels Amazing
When I committed fixes to GitHub automatically - that was the "aha!" moment. The AI didn't just fix code, it completed the entire workflow.

---

## 🚧 Problems I Faced (and How I Solved Them)

### Problem 1: better-sqlite3 wouldn't install
**Issue:** Native module compilation failed because I didn't have Visual Studio installed.

**Solution:** Switched to a JSON-file based state management instead. Simple but worked perfectly.

### Problem 2: Hydration Errors in Next.js
**Issue:** Dashboard showed "Text content does not match server-rendered HTML" error because timestamps rendered differently on server vs client.

**Solution:** Used string manipulation instead of `toLocaleTimeString()` - extracted time from ISO string directly.

### Problem 3: Services Showed as "UNKNOWN"
**Issue:** The status checker tried to connect to actual HTTP endpoints, but the services weren't running.

**Solution:** The "mock" approach works by modifying actual code files. When code has bugs, it's "down" - when fixed, it's "up." The state file tracks this.

### Problem 4: GitHub Push Failed Initially
**Issue:** First push failed because I created the repo on GitHub first without initializing locally.

**Solution:** Added the remote: `git remote add origin https://github.com/Vedant-Nalge/Project-Sentinel.git`

### Problem 5: Dashboard Didn't Update Automatically
**Issue:** After fixing, the dashboard still showed CRITICAL because it was reading static mock data.

**Solution:** Created an API route (`/api/status`) that reads from the JSON state file, and made the dashboard poll it every 3 seconds.

---

## 🎯 Key Takeaways

- This project changed how I think about coding
- AI agents are teammates, not replacements
- The more you guide, the better the results
- Don't be afraid to iterate - nothing worked perfectly first try

---

**Remember**: Manual coding is considered a "failure" in this project. The goal is to demonstrate your ability to *lead* AI, not to *be* the AI.