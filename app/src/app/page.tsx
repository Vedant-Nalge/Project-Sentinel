'use client';

import { useState, useEffect } from 'react';

interface Service {
  id: number;
  name: string;
  status: string;
  lastCheck: string;
  errorCount: number;
}

interface Incident {
  id: number;
  serviceId: number;
  serviceName: string;
  severity: string;
  description: string;
  createdAt: string;
  resolvedAt: string | null;
  fixCommit: string | null;
}

const services: Service[] = [
  { id: 1, name: 'auth-service', status: 'HEALTHY', lastCheck: new Date().toISOString(), errorCount: 0 },
  { id: 2, name: 'payment-service', status: 'HEALTHY', lastCheck: new Date().toISOString(), errorCount: 0 },
  { id: 3, name: 'inventory-service', status: 'HEALTHY', lastCheck: new Date().toISOString(), errorCount: 0 },
  { id: 4, name: 'notification-service', status: 'HEALTHY', lastCheck: new Date().toISOString(), errorCount: 0 },
];

const incidents: Incident[] = [];

function getStatusBadge(status: string) {
  const statusClasses: Record<string, string> = {
    HEALTHY: 'status-healthy',
    DEGRADED: 'status-degraded',
    CRITICAL: 'status-critical',
  };
  return statusClasses[status] || 'status-healthy';
}

function getSeverityBadge(severity: string) {
  const severityClasses: Record<string, string> = {
    critical: 'status-critical',
    high: 'status-degraded',
    low: 'status-healthy',
  };
  return severityClasses[severity] || 'status-healthy';
}

export default function Dashboard() {
  const [serviceList, setServiceList] = useState<Service[]>(services);
  const [incidentList, setIncidentList] = useState<Incident[]>(incidents);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    async function fetchState() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (data.services) {
          setServiceList(data.services);
        }
        if (data.incidents) {
          setIncidentList(data.incidents.map((i: any) => ({
            ...i,
            serviceName: data.services.find((s: any) => s.id === i.serviceId)?.name || 'Unknown'
          })));
        }
      } catch (e) {
        console.error('Failed to fetch state:', e);
      }
    }

    fetchState();

    if (autoRefresh) {
      const interval = setInterval(fetchState, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const healthyCount = serviceList.filter(s => s.status === 'HEALTHY').length;
  const criticalCount = serviceList.filter(s => s.status === 'CRITICAL').length;
  const resolvedCount = incidentList.filter(i => i.resolvedAt !== null).length;
  const activeCount = incidentList.filter(i => i.resolvedAt === null).length;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Project Sentinel
              </h1>
              <p className="text-slate-400 mt-2 text-lg">
                Autonomous Incident Resolution Engine
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg border ${
                  autoRefresh
                    ? 'bg-sentinel-accent text-white border-sentinel-accent'
                    : 'border-sentinel-border text-slate-400 hover:border-slate-500'
                }`}
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="sentinel-card">
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">System Health</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {Math.round((healthyCount / serviceList.length) * 100)}%
              </span>
              <span className="text-emerald-400">Healthy</span>
            </div>
          </div>

          <div className="sentinel-card">
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">Active Incidents</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${criticalCount > 0 ? 'text-red-400' : 'text-white'}`}>
                {activeCount}
              </span>
              <span className={criticalCount > 0 ? 'text-red-400' : 'text-emerald-400'}>
                {criticalCount > 0 ? 'Critical' : 'None'}
              </span>
            </div>
          </div>

          <div className="sentinel-card">
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">Resolved by Claude</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{resolvedCount}</span>
              <span className="text-sentinel-accent">Incidents</span>
            </div>
          </div>

          <div className="sentinel-card">
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">Services Monitored</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{serviceList.length}</span>
              <span className="text-slate-400">Total</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="sentinel-card">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Service Status
            </h2>
            <div className="space-y-4">
              {serviceList.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-sentinel-dark/50 border border-sentinel-border"
                >
                  <div>
                    <div className="font-medium text-white">{service.name}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      Last check: {service.lastCheck.split('T')[1]?.split('.')[0] || 'N/A'}
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusBadge(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="sentinel-card">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              Active Incidents
            </h2>
            {incidentList.filter(i => !i.resolvedAt).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛡️</div>
                <div className="text-slate-400">No active incidents</div>
                <div className="text-slate-500 text-sm mt-2">All systems operational</div>
              </div>
            ) : (
              <div className="space-y-4">
                {incidentList.filter(i => !i.resolvedAt).map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 rounded-lg bg-sentinel-dark/50 border border-sentinel-border"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-white">{incident.serviceName}</div>
                        <div className="text-sm text-slate-400 mt-1">{incident.description}</div>
                      </div>
                      <span className={`status-badge ${getSeverityBadge(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-3">
                      Created: {incident.createdAt.replace('T', ' ').split('.')[0]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sentinel-card lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sentinel-accent"></span>
              Resolved Incidents
            </h2>
            {incidentList.filter(i => i.resolvedAt).length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-400">No resolved incidents yet</div>
                <div className="text-slate-500 text-sm mt-1">
                  Run the Chaos Monkey to test autonomous resolution
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {incidentList.filter(i => i.resolvedAt).map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-sentinel-dark/50 border border-sentinel-border"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400">✓</span>
                      <div>
                        <div className="font-medium text-white">{incident.serviceName}</div>
                        <div className="text-sm text-slate-500">{incident.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">
                        Resolved: {incident.resolvedAt ? incident.resolvedAt.replace('T', ' ').split('.')[0] : 'N/A'}
                      </div>
                      {incident.fixCommit && (
                        <div className="text-xs text-sentinel-accent mt-1">
                          Commit: {incident.fixCommit.substring(0, 7)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-sentinel-accent/20 to-purple-500/20 border border-sentinel-accent/30">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🤖</div>
            <div>
              <h3 className="text-lg font-semibold text-white">Sentinel Agent Ready</h3>
              <p className="text-slate-400">
                Command me to diagnose and fix critical incidents autonomously.
                Try: <code className="text-sentinel-accent">node scripts/chaos-monkey.js</code> to inject a bug
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}