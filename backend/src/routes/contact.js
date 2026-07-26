import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  db.prepare(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
  ).run(name, email.toLowerCase(), subject || 'General Inquiry', message);

  res.status(201).json({ message: 'Message sent successfully. We will get back to you soon!' });
});

export default router;
