import {getFirestore} from 'firebase/firestore';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLbJI4VXrPBoGv7Owt8TpQQWJrhxqkbhY",
  authDomain: "sales-adminstration.firebaseapp.com",
  projectId: "sales-adminstration",
  storageBucket: "sales-adminstration.appspot.com",
  messagingSenderId: "151285649977",
  appId: "1:151285649977:web:552b82aa977ca46419b3e8",
  measurementId: "G-K7ZHC5P312"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db=getFirestore(app);