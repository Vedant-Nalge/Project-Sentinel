/**
 * Status Check Script
 * Polls service health and updates MCP database
 */

const { exec } = require('child_process');
const path = require('path');

const SERVICES = [
  { name: 'auth-service', port: 3001 },
  { name: 'payment-service', port: 3002 },
  { name: 'inventory-service', port: 3003 },
  { name: 'notification-service', port: 3004 },
];

async function checkService(service) {
  return new Promise((resolve) => {
    const url = `http://localhost:${service.port}/health`;
    const http = require('http');

    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            name: service.name,
            status: json.status === 'healthy' ? 'HEALTHY' : 'DEGRADED',
            timestamp: json.timestamp
          });
        } catch (e) {
          resolve({ name: service.name, status: 'CRITICAL', error: e.message });
        }
      });
    });

    req.on('error', () => {
      resolve({ name: service.name, status: 'UNKNOWN', error: 'Connection refused' });
    });

    req.setTimeout(2000, () => {
      req.destroy();
      resolve({ name: service.name, status: 'UNKNOWN', error: 'Timeout' });
    });
  });
}

async function runStatusCheck() {
  console.log('🔍 Checking service status...\n');

  const results = await Promise.all(SERVICES.map(checkService));

  console.log('┌─────────────────────────────┬─────────────┬──────────────────────┐');
  console.log('│ Service                     │ Status      │ Last Check           │');
  console.log('├─────────────────────────────┼─────────────┼──────────────────────┤');

  results.forEach(r => {
    const statusColor = {
      HEALTHY: '✓',
      DEGRADED: '⚠',
      CRITICAL: '✗',
      UNKNOWN: '?'
    }[r.status];
    console.log(`│ ${r.name.padEnd(27)} │ ${statusColor} ${r.status.padEnd(10)} │ ${(r.timestamp || r.error || 'N/A').substring(0, 20).padEnd(20)} │`);
  });

  console.log('└─────────────────────────────┴─────────────┴──────────────────────┘\n');

  const criticalCount = results.filter(r => r.status === 'CRITICAL').length;
  if (criticalCount > 0) {
    console.log(`⚠ ${criticalCount} service(s) in CRITICAL state!`);
    console.log('Run Chaos Monkey to inject bugs and test autonomous resolution.');
  }

  return results;
}

if (require.main === module) {
  runStatusCheck().then(() => process.exit(0));
}

module.exports = { runStatusCheck };