import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

interface TNotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  sentAt: string;
}

const notifications: TNotification[] = [
  { id: 'notif_001', userId: '1', type: 'email', message: 'Welcome to Sentinel!', sentAt: '2024-01-15T10:00:00Z' },
  { id: 'notif_002', userId: '2', type: 'sms', message: 'Your order has shipped', sentAt: '2024-01-16T14:30:00Z' },
  { id: 'notif_003', userId: '3', type: 'push', message: 'New message received', sentAt: '2024-01-17T09:15:00Z' }
];

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'notification-service', timestamp: new Date().toISOString() });
});

app.get('/api/notifications', (_req: Request, res: Response) => {
  res.json({ success: true, data: notifications, count: notifications.length });
});

app.get('/api/notifications/:id', (req: Request, res: Response) => {
  const notifId: string = req.params.id;
  const notification = notifications.find((n: TNotification) => n.id === notifId);

  if (notification) {
    res.json({ success: true, data: notification });
  } else {
    res.status(404).json({ success: false, error: 'Notification not found' });
  }
});

app.post('/api/notifications/send', (req: Request, res: Response) => {
  const { userId, type, message } = req.body;

  if (userId && type && message) {
    const newNotif: TNotification = {
      id: 'notif_' + Date.now(),
      userId,
      type,
      message,
      sentAt: new Date().toISOString()
    };
    notifications.push(newNotif);
    res.json({ success: true, data: newNotif });
  } else {
    res.status(400).json({ success: false, error: 'Invalid notification data' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
  });
}

export default app;