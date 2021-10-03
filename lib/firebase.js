import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDLmbha4rdpduUuyoFMQYhF-DkM05t23Rk",
    authDomain: "instagram-1b563.firebaseapp.com",
    projectId: "instagram-1b563",
    storageBucket: "instagram-1b563.appspot.com",
    messagingSenderId: "641675826841",
    appId: "1:641675826841:web:53ee5e9b1813d003138a08"
  };

const firebase = initializeApp(firebaseConfig)

export const auth = getAuth(firebase)
export const googleProvider = new GoogleAuthProvider()

export const firestore = getFirestore(firebase)

export const storage = getStorage(firebase)