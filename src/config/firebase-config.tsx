// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCr8bjddBfLS4rwql1nwagBdQjSLRJaRek',
    authDomain: 'chat-app-98075.firebaseapp.com',
    projectId: 'chat-app-98075',
    storageBucket: 'chat-app-98075.appspot.com',
    messagingSenderId: '499094860549',
    appId: '1:499094860549:web:55abdf0b8dba92cdc1fd6c',
    measurementId: 'G-N7P795Q6BB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(
    app,
    'gs://chat-app-98075.firebasestorage.app',
);
// const messaging = getMessaging(app);

// export const requestNotificationPermission = async () => {
//     try {
//         const token = await getToken(messaging, {
//             vapidKey:
//                 'BJVAya1NZ6Lq6_U2jdgrz73CMZbc6v9i-aBzhAXg4lfvjpv_OIs6lUNoBJDqgasS-iYVwddJq3RUR3HAGJs2bLA',
//         });
//         console.log('FCM Token: ', token);
//         return token;
//     } catch (error) {
//         console.error('Error getting FCM token: ', error);
//     }
// };

// export const listenForNotifications = () => {
//     onMessage(messaging, (payload) => {
//         console.log('Message received: ', payload);
//         alert(`New message: ${payload.notification?.title}`);
//     });
// };
