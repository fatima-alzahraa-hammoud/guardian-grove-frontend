importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBC410mQOyieErF1xa9KEDjJ-9BrPHMtzY",
  authDomain: "guardian-grove-project.firebaseapp.com",
  projectId: "guardian-grove-project",
  storageBucket: "guardian-grove-project.firebasestorage.app",
  messagingSenderId: "703581295514",
  appId: "1:703581295514:web:597c0fd328761630066023",
  measurementId: "G-197BH07BGT"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Add null checks to prevent errors
  const notificationTitle = payload.notification?.title || 'Guardian Grove';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || 'public/assets/logo/GuardianGrove_logo_NoText.png',
    badge: '/assets/logo/GuardianGrove_logo_NoText.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/assets/images/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});