const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');
const {
  getNotifications,
  markAsRead,
  subscribeToPush,
  sendTestNotification,
  sendBroadcastNotification
} = require('../controllers/notification.controller');

// Expose public key
router.get('/vapid-public-key', (req, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY || '');
});

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.post('/subscribe', subscribeToPush);
router.post('/test', sendTestNotification); // Usually admin only, but kept open for testing
router.post('/broadcast', adminOnly, sendBroadcastNotification);

module.exports = router;
