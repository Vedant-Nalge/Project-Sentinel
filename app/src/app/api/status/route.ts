import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dataDir = path.join(process.cwd(), 'data');
  const statePath = path.join(dataDir, 'sentinel-state.json');

  try {
    if (fs.existsSync(statePath)) {
      const data = fs.readFileSync(statePath, 'utf8');
      return NextResponse.json(JSON.parse(data));
    }
  } catch (e) {
    console.error('Error reading state:', e);
  }

  // Return default state if no file exists
  return NextResponse.json({
    services: [
      { id: 1, name: 'auth-service', status: 'HEALTHY', lastCheck: new Date().toISOString(), errorCount: 0 },
      { id: 2, name: 'payment-service', status: 'HEALTHY', lastCheck: new Date().toISOString(), errorCount: 0 },
      { id: 3, name: 'inventory-service', status: 'HEALTHY', lastCheck: new Date().toISOString(), errorCount: 0 },
      { id: 4, name: 'notification-service', status: 'HEALTHY', lastCheck: new Date().toISOString(), errorCount: 0 },
    ],
    incidents: []
  });
}