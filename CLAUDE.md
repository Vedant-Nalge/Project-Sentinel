# Project Sentinel - CLAUDE.md

## Project Overview
- **Project Name**: Project Sentinel - Autonomous Incident Resolution Engine
- **Type**: DevOps Monitoring Dashboard with Autonomous Fix Capability
- **Core Functionality**: A Next.js dashboard that monitors microservices, detects failures via MCP, and spawns Claude subagents to autonomously diagnose, fix, and test broken services
- **Target Users**: DevOps engineers, SREs, and development teams

---

## Architecture

### Monorepo Structure
```
/app          - Next.js 14 dashboard (App Router)
/services     - Node.js microservices (simulation targets)
/scripts      - Chaos Monkey script (bug injection)
/docs         - Incident history and logs
```

### Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js microservices with Express
- **Database**: SQLite MCP for status tracking
- **Agent System**: Claude subagents for autonomous debugging/QA

---

## Resolution Protocol

**CRITICAL**: Before applying ANY fix, the agent MUST follow this protocol:

1. **Check Incident History**: Always read `/docs/incident-history.log` before fixing
   - If this bug has failed before, log it in CLAUDE.md as a "known failure"
   - Use Thinking Mode to find an alternative approach

2. **Diagnosis Phase**:
   - Read service logs in `/services/*/logs/`
   - Run diagnostic commands: `npm test` or `node debug.js`
   - Identify root cause (syntax error, type mismatch, logic error, missing dependency, corrupted config)

3. **Fix Implementation**:
   - Apply minimal fix - never rewrite entire files
   - Follow naming conventions below
   - Add regression test before committing

4. **Verification**:
   - Run `npm test` to verify fix
   - Update dashboard status via MCP
   - Log resolution in `/docs/incident-history.log`

---

## TypeScript & Naming Conventions

### Strict Rules
- **Variables**: camelCase, descriptive (e.g., `incidentCount`, `serviceStatus`)
- **Constants**: UPPER_SNAKE_CASE for config (e.g., `MAX_RETRIES`, `CRITICAL_THRESHOLD`)
- **Types/Interfaces**: PascalCase with `T` prefix (e.g., `TServiceStatus`, `TIncident`)
- **Components**: PascalCase (e.g., `IncidentCard`, `StatusBadge`)
- **Files**: kebab-case (e.g., `service-monitor.ts`, `chaos-engine.ts`)

### Code Quality
- Never use `any` - use `unknown` or proper generics
- Always define return types for functions
- Use strict null checks
- Prefer async/await over callbacks

---

## Service Definitions

### Microservices (in /services)
1. **auth-service** - Authentication microservice (port 3001)
2. **payment-service** - Payment processing (port 3002)
3. **inventory-service** - Product inventory (port 3003)
4. **notification-service** - Push notifications (port 3004)

### Each service has:
- `src/index.ts` - Main entry point
- `src/routes/*.ts` - API routes
- `logs/error.log` - Error logs
- `package.json` - Dependencies

---

## MCP Integration

### SQLite MCP for Status Tracking
- Database: `/app/sentinel.db` (SQLite)
- Tables:
  - `services` (id, name, status, last_check, error_count)
  - `incidents` (id, service_id, severity, description, created_at, resolved_at, fix_commit)
  - `resolutions` (id, incident_id, attempt, fix_code, success)

### Polling Strategy
- Use cron to poll every 30 seconds: `*/30 * * * * *`
- Status states: `HEALTHY`, `DEGRADED`, `CRITICAL`, `UNKNOWN`

---

## Agent Orchestration

### Main Agent (Dashboard Manager)
- Manages UI state
- Coordinates subagents
- Updates incident status
- Generates reports

### Subagent Alpha (Debugger)
- Analyzes error logs
- Traces through code to find root cause
- Proposes fix implementation

### Subagent Beta (QA Engineer)
- Writes regression tests
- Verifies fix doesn't break other services
- Validates against incident-history.log

---

## Incident Workflow

```
1. Chaos Monkey injects bug
2. MCP detects CRITICAL status
3. Main Agent spawns Subagent Alpha
4. Alpha diagnoses and proposes fix
5. Main Agent spawns Subagent Beta
6. Beta writes test
7. Main Agent commits fix
8. MCP verifies resolution
9. Dashboard shows RESOLVED
10. Post-mortem generated
```

---

## Commands Reference

```bash
# Run Chaos Monkey
node scripts/chaos-monkey.js

# Poll status via MCP
sqlite3 app/sentinel.db "SELECT * FROM services"

# Start dashboard
cd app && npm run dev

# Run all tests
npm test

# View incident history
cat docs/incident-history.log
```

---

## Important Notes

- **NO MANUAL CODING**: Use Claude commands to generate all code
- **Always use subagents** for debugging and QA tasks
- **Never skip the Resolution Protocol** - it's required for all fixes
- **Log EVERY incident** in incident-history.log before and after resolution