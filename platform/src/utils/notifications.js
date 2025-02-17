export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = async ({ title, body, icon, data = {} }) => {
  if (!await requestNotificationPermission()) {
    throw new Error('Notification permission not granted');
  }

  try {
    const notification = new Notification(title, {
      body,
      icon,
      data,
      badge: '/assets/logo.png',
      requireInteraction: true
    });

    notification.onclick = function(event) {
      event.preventDefault();
      // Handle notification click
      // You can navigate to specific pages based on the notification data
      if (data.eventId) {
        // Navigate to event details
        window.open(`/events/${data.eventId}`, '_blank');
      }
      notification.close();
    };

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
