import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

interface TProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

const products: TProduct[] = [
  { id: 'prod_001', name: 'Laptop Pro', sku: 'LP-2024', quantity: 50, price: 1299.99 },
  { id: 'prod_002', name: 'Wireless Mouse', sku: 'WM-001', quantity: 200, price: 29.99 },
  { id: 'prod_003', name: 'USB-C Hub', sku: 'UH-042', quantity: 75, price: 49.99 }
];

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'inventory-service', timestamp: new Date().toISOString() });
});

app.get('/api/products', (_req: Request, res: Response) => {
  res.json({ success: true, data: products, count: products.length });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const productId: string = req.params.id;
  const product = products.find((p: TProduct) => p.id === productId);

  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, error: 'Product not found' });
  }
});

app.put('/api/products/:id/stock', (req: Request, res: Response) => {
  const productId: string = req.params.id;
  const { quantity } = req.body;
  const product = products.find((p: TProduct) => p.id === productId);

  if (product) {
    product.quantity = quantity;
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, error: 'Product not found' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Inventory service running on port ${PORT}`);
  });
}

export default app;