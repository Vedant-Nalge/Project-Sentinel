import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface TUser {
  id: string;
  username: string;
  email: string;
  status: string;
}

const users: TUser[] = [
  { id: '1', username: 'admin', email: 'admin@sentinel.io', status: 'active' },
  { id: '2', username: 'developer', email: 'dev@sentinel.io', status: 'active' },
  { id: '3', username: 'operator', email: 'ops@sentinel.io', status: 'inactive' }
];

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'auth-service', timestamp: new Date().toISOString() });
});

app.get('/api/users', (_req: Request, res: Response) => {
  res.json({ success: true, data: users, count: users.length });
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const userId: string = req.params.id;
  const user = users.find((u: TUser) => u.id === userId);

  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ success: false, error: 'User not found' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username && password) {
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: { id: '1', username }
    });
  } else {
    res.status(400).json({ success: false, error: 'Invalid credentials' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
}

export default app;