// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import * as firebase from "firebase";
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFo1-PBex3xKy1SVzu1g3nJdNb8pSAuQc",
  authDomain: "exchange-of-holiday-apar-45a07.firebaseapp.com",
  projectId: "exchange-of-holiday-apar-45a07",
  storageBucket: "exchange-of-holiday-apar-45a07.appspot.com",
  messagingSenderId: "1059436044818",
  appId: "1:1059436044818:web:037de8d7a36cf4c3adaecb",
  measurementId: "G-6VJX1H7YP3",
};

// Initialize Firebase
// let app;
// if (!firebase.apps.length === 0) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = firebase.app();
// }
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const storageRef = ref(storage);
// const storage = getStorage(app);
export { auth, db, app, storage, ref };
