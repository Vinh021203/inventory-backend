import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { updateRow, deleteRow } from './sheets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/inventory/update', async (req, res) => {
  try {
    const { rowIndex, data } = req.body;
    if (!rowIndex || !data || typeof data !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    }
    const result = await updateRow(rowIndex, data);
    res.json({ success: true, result });
  } catch (err) {
    console.error('update error:', err);
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

// ROUTE MỚI: delete 1 dòng
app.delete('/inventory/delete', async (req, res) => {
  try {
    const rowIndex = Number(req.query.rowIndex);
    if (!rowIndex) {
      return res.status(400).json({ success: false, error: 'Missing rowIndex' });
    }
    const result = await deleteRow(rowIndex);
    res.json({ success: true, result });
  } catch (err) {
    console.error('delete error:', err);
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Inventory backend running on port ${PORT}`);
});
