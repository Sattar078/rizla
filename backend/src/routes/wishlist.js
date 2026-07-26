import { Router } from 'express';
import db from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { formatProduct } from '../utils/formatProduct.js';

const router = Router();

router.get('/', authenticate, (req, res) => {
  const rows = db
    .prepare(
      `SELECT w.id, p.*
       FROM wishlist_items w
       JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`
    )
    .all(req.user.id);

  const items = rows.map((row) => ({
    id: row.id,
    product: formatProduct(row),
  }));

  res.json({ items });
});

router.post('/:productId', authenticate, (req, res) => {
  const productId = req.params.productId;
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = db
    .prepare('SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?')
    .get(req.user.id, productId);

  if (existing) {
    return res.json({ message: 'Already in wishlist', inWishlist: true });
  }

  db.prepare('INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)').run(
    req.user.id,
    productId
  );

  res.status(201).json({ message: 'Added to wishlist', inWishlist: true });
});

router.delete('/:productId', authenticate, (req, res) => {
  db.prepare('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?').run(
    req.user.id,
    req.params.productId
  );
  res.json({ message: 'Removed from wishlist', inWishlist: false });
});

router.get('/check/:productId', authenticate, (req, res) => {
  const item = db
    .prepare('SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?')
    .get(req.user.id, req.params.productId);
  res.json({ inWishlist: Boolean(item) });
});

export default router;
