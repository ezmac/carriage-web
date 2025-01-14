const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const convertedVapidKey = urlBase64ToUint8Array(
  process.env.REACT_APP_PUBLIC_VAPID_KEY!
);

type WithDefaultsType = (options?: RequestInit | undefined) => RequestInit;

const sendSubscription = (
  userType: string,
  userId: string,
  sub: PushSubscription,
  withDefaults: WithDefaultsType
) => {
  const subscription = {
    userType,
    userId,
    platform: 'web',
    webSub: sub,
  };
  fetch(
    '/api/notification/subscribe',
    withDefaults({
      method: 'POST',
      body: JSON.stringify(subscription),
    })
  );
};

const subscribeUser = (
  userType: string,
  userId: string,
  withDefaults: WithDefaultsType
) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        if (!registration.pushManager) {
          // 'Push manager unavailable.'
          return;
        }

        registration.pushManager
          .getSubscription()
          .then((existedSubscription) => {
            if (existedSubscription === null) {
              // 'No subscription detected, make a request.'
              registration.pushManager
                .subscribe({
                  applicationServerKey: convertedVapidKey,
                  userVisibleOnly: true,
                })
                .then((newSubscription) => {
                  // 'New subscription added.'
                  sendSubscription(
                    userType,
                    userId,
                    newSubscription,
                    withDefaults
                  );
                })
                .catch((e) => {
                  if (Notification.permission !== 'granted') {
                    // 'Permission was not granted.'
                  }
                });
            } else {
              // 'Existed subscription detected.'
              // sending anyway right now
              sendSubscription(
                userType,
                userId,
                existedSubscription,
                withDefaults
              );
            }
          });
      })
      .catch((e) => {
        // 'An error ocurred during Service Worker registration.'
      });
  }
};

export default subscribeUser;
