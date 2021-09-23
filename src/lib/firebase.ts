// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSlUKlrxBgKlNzJsZ_0_8zZIFMB82m_qU",
  authDomain: "mangarel-isoittech.firebaseapp.com",
  projectId: "mangarel-isoittech",
  storageBucket: "mangarel-isoittech.appspot.com",
  messagingSenderId: "142582566089",
  appId: "1:142582566089:web:c83278f6349bc144359118",
  measurementId: "G-W8SWBME262",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default analytics;
