/**
 * MCP State Updater
 * Updates service status in the dashboard state file
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'app', 'data');
const statePath = path.join(dataDir, 'sentinel-state.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadState() {
  ensureDataDir();
  if (fs.existsSync(statePath)) {
    return JSON.parse(fs.readFileSync(statePath, 'utf8'));
  }
  return { services: [], incidents: [] };
}

function saveState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function initializeState() {
  const state = loadState();
  if (state.services.length === 0) {
    const now = new Date().toISOString();
    state.services = [
      { id: 1, name: 'auth-service', status: 'HEALTHY', lastCheck: now, errorCount: 0 },
      { id: 2, name: 'payment-service', status: 'HEALTHY', lastCheck: now, errorCount: 0 },
      { id: 3, name: 'inventory-service', status: 'HEALTHY', lastCheck: now, errorCount: 0 },
      { id: 4, name: 'notification-service', status: 'HEALTHY', lastCheck: now, errorCount: 0 },
    ];
    state.incidents = [];
    saveState(state);
  }
  return state;
}

function markServiceCritical(serviceName) {
  const state = loadState();
  const service = state.services.find(s => s.name === serviceName);
  if (service) {
    service.status = 'CRITICAL';
    service.errorCount = (service.errorCount || 0) + 1;
    service.lastCheck = new Date().toISOString();

    state.incidents.push({
      id: state.incidents.length + 1,
      serviceId: service.id,
      severity: 'critical',
      description: `Chaos monkey injected bug in ${serviceName}`,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      fixCommit: null
    });
    saveState(state);
    console.log(`✓ Marked ${serviceName} as CRITICAL`);
  }
  return state;
}

function resolveService(serviceName) {
  const state = loadState();
  const service = state.services.find(s => s.name === serviceName);
  if (service) {
    service.status = 'HEALTHY';
    service.lastCheck = new Date().toISOString();

    const incident = state.incidents.find(i => i.serviceId === service.id && !i.resolvedAt);
    if (incident) {
      incident.resolvedAt = new Date().toISOString();
      incident.fixCommit = 'autofix-' + Date.now();
    }
    saveState(state);
    console.log(`✓ Marked ${serviceName} as HEALTHY`);
  }
  return state;
}

module.exports = { initializeState, markServiceCritical, resolveService, loadState };

if (require.main === module) {
  initializeState();
}