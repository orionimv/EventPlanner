// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Конфиг из .env
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // должно быть *.appspot.com
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Инициализация
const app = initializeApp(firebaseConfig);

// Analytics только в браузере
let analytics;
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
    try {
        analytics = getAnalytics(app);
    } catch (e) {
        console.warn("Analytics init error:", e.message);
    }
}

// Сервисы Firebase
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Messaging с защитой
let messaging;
try {
    // Работает только в браузере (https или localhost)
    if (typeof window !== "undefined") {
        messaging = getMessaging(app);
    }
} catch (e) {
    console.warn("Messaging init error:", e.message);
}

export async function requestFcmPermissionAndToken() {
    try {
        if (!messaging || !("Notification" in window)) return null;

        const perm = await Notification.requestPermission();
        if (perm !== "granted") return null;

        // Если у тебя есть firebase-messaging-sw.js в /public — можно не указывать serviceWorkerRegistration
        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        })


        return token || null;
    } catch (e) {
        console.error("FCM getToken error:", e);
        return null;
    }
}

export function onFcmMessage(callback) {
    if (!messaging) return () => {};
    // Возвращаем функцию-отписку
    return onMessage(messaging, callback);
}

export { analytics, messaging };
export default app;
