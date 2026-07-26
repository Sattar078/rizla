import { Router } from 'express';
import db from '../db/database.js';
import { optionalAuth, getSessionId } from '../middleware/auth.js';
import { formatProduct } from '../utils/formatProduct.js';

const router = Router();

const getCartQuery = (userId, sessionId) => {
  if (userId) {
    return {
      where: 'ci.user_id = ?',
      param: userId,
    };
  }
  if (sessionId) {
    return {
      where: 'ci.session_id = ?',
      param: sessionId,
    };
  }
  return null;
};

const fetchCartItems = (userId, sessionId) => {
  const query = getCartQuery(userId, sessionId);
  if (!query) return [];

  return db
    .prepare(
      `SELECT ci.id, ci.quantity, p.*
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ${query.where}
       ORDER BY ci.created_at DESC`
    )
    .all(query.param);
};

router.get('/', optionalAuth, (req, res) => {
  const sessionId = getSessionId(req);
  const userId = req.user?.id;

  if (!userId && !sessionId) {
    return res.json({ items: [], total: 0, itemCount: 0 });
  }

  const rows = fetchCartItems(userId, sessionId);
  const items = rows.map((row) => ({
    id: row.id,
    quantity: row.quantity,
    product: formatProduct(row),
    subtotal: row.quantity * row.price,
  }));

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  res.json({ items, total, itemCount });
});

router.post('/items', optionalAuth, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const sessionId = getSessionId(req);
  const userId = req.user?.id;

  if (!productId) return res.status(400).json({ error: 'Product ID is required' });
  if (!userId && !sessionId) return res.status(400).json({ error: 'Session ID required for guest cart' });

  const product = db.prepare('SELECT * FROM products WHERE id = ? AND in_stock = 1').get(productId);
  if (!product) return res.status(404).json({ error: 'Product not found or out of stock' });

  const existing = userId
    ? db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, productId)
    : db.prepare('SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?').get(sessionId, productId);

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
  } else if (userId) {
    db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(
      userId,
      productId,
      quantity
    );
  } else {
    db.prepare('INSERT INTO cart_items (session_id, product_id, quantity) VALUES (?, ?, ?)').run(
      sessionId,
      productId,
      quantity
    );
  }

  const rows = fetchCartItems(userId, sessionId);
  const items = rows.map((row) => ({
    id: row.id,
    quantity: row.quantity,
    product: formatProduct(row),
    subtotal: row.quantity * row.price,
  }));

  res.status(201).json({
    message: 'Added to cart',
    items,
    total: items.reduce((sum, item) => sum + item.subtotal, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  });
});

router.patch('/items/:id', optionalAuth, (req, res) => {
  const { quantity } = req.body;
  const sessionId = getSessionId(req);
  const userId = req.user?.id;

  if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });

  const item = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Cart item not found' });

  if (userId && item.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });
  if (!userId && item.session_id !== sessionId) return res.status(403).json({ error: 'Forbidden' });

  db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.id);

  const rows = fetchCartItems(userId, sessionId);
  const items = rows.map((row) => ({
    id: row.id,
    quantity: row.quantity,
    product: formatProduct(row),
    subtotal: row.quantity * row.price,
  }));

  res.json({
    items,
    total: items.reduce((sum, item) => sum + item.subtotal, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  });
});

router.delete('/items/:id', optionalAuth, (req, res) => {
  const sessionId = getSessionId(req);
  const userId = req.user?.id;

  const item = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Cart item not found' });

  if (userId && item.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });
  if (!userId && item.session_id !== sessionId) return res.status(403).json({ error: 'Forbidden' });

  db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.id);

  const rows = fetchCartItems(userId, sessionId);
  const items = rows.map((row) => ({
    id: row.id,
    quantity: row.quantity,
    product: formatProduct(row),
    subtotal: row.quantity * row.price,
  }));

  res.json({
    items,
    total: items.reduce((sum, item) => sum + item.subtotal, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  });
});

router.delete('/', optionalAuth, (req, res) => {
  const sessionId = getSessionId(req);
  const userId = req.user?.id;

  if (userId) {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
  } else if (sessionId) {
    db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
  }

  res.json({ items: [], total: 0, itemCount: 0 });
});

export default router;
