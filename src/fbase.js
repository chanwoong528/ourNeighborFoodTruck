import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyChMepvIxf-flBQN3cLvmZHGnzJZm5MDXg",
    authDomain: "ourneighborfoodtruck.firebaseapp.com",
    projectId: "ourneighborfoodtruck",
    storageBucket: "ourneighborfoodtruck.appspot.com",
    messagingSenderId: "401231313659",
    appId: "1:401231313659:web:bd734f88e239176a508e5e",
    measurementId: "G-8ZRN1MD991"
  };
    // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const firebaseInstance = firebase;


  export const authService = firebase.auth();
  export const dbService = firebase.firestore();
  export const storageService = firebase.storage();