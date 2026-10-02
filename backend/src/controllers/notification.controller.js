const webpush = require('web-push');
const Notification = require('../models/Notification');
const User = require('../models/user');

// Configure Web Push with VAPID keys safely
const ensureVapidConfig = () => {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    try {
      webpush.setVapidDetails(
        'mailto:admin@rizla-boutique.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    } catch (err) {
      console.warn('VAPID setup warning:', err.message);
    }
  }
};
ensureVapidConfig();

// Subscribe to push notifications
exports.subscribeToPush = async (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription) {
      return res.status(400).json({ message: 'Missing subscription object' });
    }

    const user = await User.findById(req.user._id);
    
    // Add if not exists
    const exists = user.pushSubscriptions.some(
      (sub) => sub.endpoint === subscription.endpoint
    );
    if (!exists) {
      user.pushSubscriptions.push(subscription);
      await user.save();
    }

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all notifications for the current user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a test notification (For demonstration)
exports.sendTestNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const user = await User.findById(req.user._id);

    // Save to database for in-app notification
    const notification = await Notification.create({
      user: req.user._id,
      title: title || 'Test Notification',
      message: message || 'This is a test notification from Rizla Boutique!',
      type: 'system'
    });

    // Send Web Push to all subscriptions for this user
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.message,
      icon: '/vite.svg', // Just a placeholder icon
    });

    const sendPromises = user.pushSubscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload);
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription expired or not found, we should ideally remove it here
        } else {
          console.error('Push error:', err);
        }
      }
    });

    await Promise.all(sendPromises);

    res.status(200).json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Broadcast a notification to all users (Admin only)
exports.sendBroadcastNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    ensureVapidConfig();

    const users = await User.find({});
    
    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/vite.svg',
    });

    // We do not await all of these individually in a real massive production app 
    // to avoid blocking the request, but for this scale it is perfectly fine.
    const notifications = [];
    const sendPromises = [];

    for (const user of users) {
      notifications.push({
        user: user._id,
        title,
        message,
        type: 'system'
      });

      if (user.pushSubscriptions && user.pushSubscriptions.length > 0) {
        for (const sub of user.pushSubscriptions) {
          sendPromises.push(
            webpush.sendNotification(sub, payload).catch(err => {
              // Ignore expired subscriptions silently
            })
          );
        }
      }
    }

    // Insert all in-app notifications
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
    
    // Send all push notifications
    if (sendPromises.length > 0) {
      await Promise.all(sendPromises);
    }

    res.status(200).json({ 
      success: true, 
      message: `Notification broadcasted to ${users.length} users.` 
    });

  } catch (error) {
    console.error('Broadcast Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
