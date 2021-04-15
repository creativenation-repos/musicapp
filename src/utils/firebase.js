// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAPSLS3bcx62CEWuOOc-NXKO_3Ys_H-HQk",
  authDomain: "musicademy-2021.firebaseapp.com",
  projectId: "musicademy-2021",
  storageBucket: "musicademy-2021.appspot.com",
  messagingSenderId: "768437036610",
  appId: "1:768437036610:web:904069e49fda4ac30fefdb",
  measurementId: "G-T8NK6Q16C1",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

// Timestamp
export const firebaseTimestamp = firebase.firestore.FieldValue.serverTimestamp();

// Collections
export const users_Collection = db.collection("Users");
export const teachers_Collection = db.collection("Teachers");
export const students_Collection = db.collection("Student");
export const groups_Collection = db.collection("Groups");
export const forums_Collection = db.collection("Forums");
export const articles_Collection = db.collection("Articles");
export const courses_Collection = db.collection("Courses");
export const studentReqQueue_Collection = db.collection("StudentReqQueue");
export const groupReqQueue_Collection = db.collection("GroupReqQueue");

////////////////////////////////
export default firebase;
