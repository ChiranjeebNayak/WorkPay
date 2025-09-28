// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh6SaVKTs45Lz-OpSgEbQG5LNTb-lzy9A",
  authDomain: "workpay-2f50e.firebaseapp.com",
  projectId: "workpay-2f50e",
  storageBucket: "workpay-2f50e.firebasestorage.app",
  messagingSenderId: "295652306741",
  appId: "1:295652306741:web:a9df9a1e7620a97b3fe67c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth ,app};
