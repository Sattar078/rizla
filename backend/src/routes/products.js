import { Router } from 'express';
import db from '../db/database.js';
import { formatProduct } from '../utils/formatProduct.js';

const router = Router();

router.get('/', (req, res) => {
  const { category, q, collection, page = 1, limit = 12, sale } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND LOWER(category) = LOWER(?)';
    params.push(category);
  }

  if (collection) {
    query += ' AND LOWER(collection) LIKE LOWER(?)';
    params.push(`%${collection}%`);
  }

  if (q) {
    query += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(brand) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?))';
    const search = `%${q}%`;
    params.push(search, search, search);
  }

  if (sale === 'true') {
    query += ' AND discount > 0';
  }

  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  const total = db.prepare(countQuery).get(...params).total;

  query += ' ORDER BY id ASC LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);

  const products = db.prepare(query).all(...params).map(formatProduct);

  res.json({
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

router.get('/categories', (_req, res) => {
  const categories = db.prepare('SELECT slug as id, label FROM categories ORDER BY id').all();
  res.json({ categories });
});

router.get('/collections', (_req, res) => {
  const collections = db.prepare('SELECT * FROM collections ORDER BY id').all();
  res.json({ collections });
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: formatProduct(product) });
});

export default router;
