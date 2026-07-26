import { Router } from 'express';
import db from '../db/database.js';
import { optionalAuth, getSessionId } from '../middleware/auth.js';
import { formatProduct } from '../utils/formatProduct.js';

const router = Router();

router.post('/', optionalAuth, (req, res) => {
  const {
    shippingName,
    shippingEmail,
    shippingPhone,
    shippingAddress,
    shippingCity,
    shippingPincode,
    paymentMethod = 'cod',
  } = req.body;

  const sessionId = getSessionId(req);
  const userId = req.user?.id;

  if (!shippingName || !shippingEmail || !shippingPhone || !shippingAddress || !shippingCity || !shippingPincode) {
    return res.status(400).json({ error: 'All shipping fields are required' });
  }

  const cartQuery = userId
    ? db
        .prepare(
          `SELECT ci.quantity, p.*
           FROM cart_items ci
           JOIN products p ON p.id = ci.product_id
           WHERE ci.user_id = ?`
        )
        .all(userId)
    : sessionId
      ? db
          .prepare(
            `SELECT ci.quantity, p.*
             FROM cart_items ci
             JOIN products p ON p.id = ci.product_id
             WHERE ci.session_id = ?`
          )
          .all(sessionId)
      : [];

  if (cartQuery.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const total = cartQuery.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const createOrder = db.transaction(() => {
    const orderResult = db
      .prepare(
        `INSERT INTO orders (user_id, session_id, status, total, shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city, shipping_pincode, payment_method)
         VALUES (?, ?, 'confirmed', ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        userId || null,
        sessionId || null,
        total,
        shippingName,
        shippingEmail,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingPincode,
        paymentMethod
      );

    const orderId = orderResult.lastInsertRowid;
    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
    );

    for (const item of cartQuery) {
      insertItem.run(orderId, item.id, item.quantity, item.price);
    }

    if (userId) {
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
    } else if (sessionId) {
      db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
    }

    return Number(orderId);
  });

  const orderId = createOrder();

  const orderItems = db
    .prepare(
      `SELECT oi.quantity, oi.price, p.*
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`
    )
    .all(orderId);

  res.status(201).json({
    message: 'Order placed successfully',
    order: {
      id: orderId,
      status: 'confirmed',
      total,
      paymentMethod,
      items: orderItems.map((row) => ({
        quantity: row.quantity,
        price: row.price,
        product: formatProduct(row),
      })),
      shipping: {
        name: shippingName,
        email: shippingEmail,
        phone: shippingPhone,
        address: shippingAddress,
        city: shippingCity,
        pincode: shippingPincode,
      },
    },
  });
});

router.get('/', optionalAuth, (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.json({ orders: [] });

  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId);

  const ordersWithItems = orders.map((order) => {
    const items = db
      .prepare(
        `SELECT oi.quantity, oi.price, p.*
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`
      )
      .all(order.id);

    return {
      id: order.id,
      status: order.status,
      total: order.total,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
      shipping: {
        name: order.shipping_name,
        email: order.shipping_email,
        phone: order.shipping_phone,
        address: order.shipping_address,
        city: order.shipping_city,
        pincode: order.shipping_pincode,
      },
      items: items.map((row) => ({
        quantity: row.quantity,
        price: row.price,
        product: formatProduct(row),
      })),
    };
  });

  res.json({ orders: ordersWithItems });
});

router.get('/:id', optionalAuth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const items = db
    .prepare(
      `SELECT oi.quantity, oi.price, p.*
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`
    )
    .all(order.id);

  res.json({
    order: {
      id: order.id,
      status: order.status,
      total: order.total,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
      shipping: {
        name: order.shipping_name,
        email: order.shipping_email,
        phone: order.shipping_phone,
        address: order.shipping_address,
        city: order.shipping_city,
        pincode: order.shipping_pincode,
      },
      items: items.map((row) => ({
        quantity: row.quantity,
        price: row.price,
        product: formatProduct(row),
      })),
    },
  });
});

export default router;
