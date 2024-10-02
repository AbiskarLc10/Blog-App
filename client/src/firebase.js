// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log(import.meta.env.VITE_FIREBASEAPIKEY);
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASEAPIKEY,
  authDomain: "mern-blog-df0ca.firebaseapp.com",
  projectId: "mern-blog-df0ca",
  storageBucket: "mern-blog-df0ca.appspot.com",
  messagingSenderId: "423575078341",
  appId: "1:423575078341:web:2157399ed793f30f95b7ac"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

