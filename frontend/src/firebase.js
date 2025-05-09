// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAbqV-CmCvV1aC0nJCXHArXoYh1xqU5jXY",
    authDomain: "chatbot-powered-by-openai.firebaseapp.com",
    projectId: "chatbot-powered-by-openai",
    storageBucket: "chatbot-powered-by-openai.firebasestorage.app",
    messagingSenderId: "827150950984",
    appId: "1:827150950984:web:3f4c1fbca28d8e762b2e7d",
    measurementId: "G-MT546X8RSH"
  };
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
