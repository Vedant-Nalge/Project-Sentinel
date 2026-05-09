import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

interface TTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  userId: string;
}

const transactions: TTransaction[] = [
  { id: 'txn_001', amount: 99.99, currency: 'USD', status: 'completed', userId: '1' },
  { id: 'txn_002', amount: 149.50, currency: 'USD', status: 'pending', userId: '2' },
  { id: 'txn_003', amount: 250.00, currency: 'USD', status: 'failed', userId: '3' }
];

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'payment-service', timestamp: new Date().toISOString() });
});

app.get('/api/transactions', (_req: Request, res: Response) => {
  res.json({ success: true, data: transactions, count: transactions.length });
});

app.get('/api/transactions/:id', (req: Request, res: Response) => {
  const txnId: string = req.params.id;
  const transaction = transactions.find((t: TTransaction) => t.id === txnId);

  if (transaction) {
    res.json({ success: true, data: transaction });
  } else {
    res.status(404).json({ success: false, error: 'Transaction not found' });
  }
});

app.post('/api/payments/process', (req: Request, res: Response) => {
  const { amount, currency, userId } = req.body;

  if (amount && currency && userId) {
    const newTxn: TTransaction = {
      id: 'txn_' + Date.now(),
      amount: parseFloat(amount),
      currency,
      status: 'completed',
      userId
    };
    transactions.push(newTxn);
    res.json({ success: true, data: newTxn });
  } else {
    res.status(400).json({ success: false, error: 'Invalid payment data' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
  });
}

export default app;