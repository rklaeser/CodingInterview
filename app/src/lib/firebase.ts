import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
	apiKey: "AIzaSyCLRGBtd5UdVsm_9bdiYEK-7LYyt0gnAwc",
	authDomain: "codinginterview-f9a20.firebaseapp.com",
	projectId: "codinginterview-f9a20",
	storageBucket: "codinginterview-f9a20.firebasestorage.app",
	messagingSenderId: "264875171841",
	appId: "1:264875171841:web:12d3a929329ea751782000",
	measurementId: "G-6TBTNMWFND"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
