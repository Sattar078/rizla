import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email.toLowerCase());
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email already subscribed' });
    }
    throw err;
  }
});

export default router;
