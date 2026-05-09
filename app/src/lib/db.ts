/**
 * MCP Database Setup for Project Sentinel
 * JSON-based status tracking (simulating SQLite MCP)
 */

import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '..', '..', '..', 'data');
const dbPath = path.join(dataDir, 'sentinel-state.json');

interface ServiceData {
  id: number;
  name: string;
  status: string;
  lastCheck: string;
  errorCount: number;
  createdAt: string;
}

interface IncidentData {
  id: number;
  serviceId: number;
  severity: string;
  description: string;
  createdAt: string;
  resolvedAt: string | null;
  fixCommit: string | null;
}

interface Database {
  services: ServiceData[];
  incidents: IncidentData[];
}

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadDatabase(): Database {
  ensureDataDir();
  if (fs.existsSync(dbPath)) {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
  return { services: [], incidents: [] };
}

function saveDatabase(db: Database) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function initializeDatabase() {
  const services = [
    { name: 'auth-service', port: 3001 },
    { name: 'payment-service', port: 3002 },
    { name: 'inventory-service', port: 3003 },
    { name: 'notification-service', port: 3004 },
  ];

  const db = loadDatabase();

  if (db.services.length === 0) {
    const now = new Date().toISOString();
    services.forEach((s, i) => {
      db.services.push({
        id: i + 1,
        name: s.name,
        status: 'HEALTHY',
        lastCheck: now,
        errorCount: 0,
        createdAt: now,
      });
    });
    saveDatabase(db);
  }

  console.log('✓ Database initialized at', dbPath);
  return db;
}

export function updateServiceStatus(serviceName: string, status: string, errorCount: number = 0) {
  const db = loadDatabase();
  const service = db.services.find(s => s.name === serviceName);

  if (service) {
    service.status = status;
    service.errorCount = errorCount;
    service.lastCheck = new Date().toISOString();
    saveDatabase(db);
  }

  return service;
}

export function getServices(): ServiceData[] {
  return loadDatabase().services;
}

export function createIncident(serviceId: number, severity: string, description: string) {
  const db = loadDatabase();
  const incident: IncidentData = {
    id: db.incidents.length + 1,
    serviceId,
    severity,
    description,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    fixCommit: null,
  };
  db.incidents.push(incident);
  saveDatabase(db);
  return incident;
}

export function resolveIncident(incidentId: number, fixCommit: string) {
  const db = loadDatabase();
  const incident = db.incidents.find(i => i.id === incidentId);

  if (incident) {
    incident.resolvedAt = new Date().toISOString();
    incident.fixCommit = fixCommit;
    saveDatabase(db);
  }

  return incident;
}

export function getIncidents(): (IncidentData & { serviceName: string })[] {
  const db = loadDatabase();
  return db.incidents.map(incident => {
    const service = db.services.find(s => s.id === incident.serviceId);
    return {
      ...incident,
      serviceName: service?.name || 'Unknown',
    };
  });
}

if (require.main === module) {
  initializeDatabase();
  console.log('Services:', getServices());
}

export default { initializeDatabase, updateServiceStatus, getServices, createIncident, resolveIncident, getIncidents };