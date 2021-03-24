import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: 'AIzaSyChMepvIxf-flBQN3cLvmZHGnzJZm5MDXg',
  authDomain: 'ourneighborfoodtruck.firebaseapp.com',
  projectId: 'ourneighborfoodtruck',
  storageBucket: 'ourneighborfoodtruck.appspot.com',
  messagingSenderId: '401231313659',
  appId: '1:401231313659:web:bd734f88e239176a508e5e',
  measurementId: 'G-8ZRN1MD991',
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket:process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId:process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID,
  // measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();

