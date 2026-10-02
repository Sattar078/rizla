import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationContext = createContext(null);

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setIsPushSupported(true);
      setPushPermission(Notification.permission);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get('/api/notifications');
      const data = response.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
      let registration = navigator.serviceWorker.controller
        ? await navigator.serviceWorker.ready
        : await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const { data: publicVapidKey } = await api.get('/api/notifications/vapid-public-key');
        if (!publicVapidKey) {
          console.warn('VAPID public key unavailable');
          return;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
      }

      await api.post('/api/notifications/subscribe', { subscription });
      console.log('Push subscription saved successfully');
    } catch (error) {
      console.error('Error during push subscription:', error);
    }
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert('Push notifications are not supported in this browser.');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      if (permission === 'granted') {
        await subscribeToPush();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Permission request failed:', err);
      return false;
    }
  };

  const testPush = async () => {
    try {
      await api.post('/api/notifications/test', {
        title: '🔔 Test Notification',
        message: 'This is a test notification from Rizla Boutique!',
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error testing push:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPushPermission(Notification.permission);
        if (Notification.permission === 'granted') {
          subscribeToPush();
        }
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        testPush,
        fetchNotifications,
        subscribeToPush,
        requestPushPermission,
        isPushSupported,
        pushPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

