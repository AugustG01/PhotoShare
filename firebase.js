// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4RD9KgGGisRLSd2Y1jwPGG7pfuNQBKl0",
  authDomain: "photoshare-540cf.firebaseapp.com",
  projectId: "photoshare-540cf",
  storageBucket: "photoshare-540cf.appspot.com",
  messagingSenderId: "493803324619",
  appId: "1:493803324619:web:5ae3fbe60ca95f41b4874e",
  measurementId: "G-ZV7WCQDQYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage }