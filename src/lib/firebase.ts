import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgym1cOAPNt6iDvM-jPo3qgrZLDvOlw2w",
  authDomain: "oentrega.firebaseapp.com",
  projectId: "oentrega",
  storageBucket: "oentrega.appspot.com",
  messagingSenderId: "807886697297",
  appId: "1:807886697297:web:0602d50696d6aeecd01970"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
