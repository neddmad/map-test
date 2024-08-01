import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcdm1iUnwfcFoXmTwDYikUxpPC8MIC8rg",
  authDomain: "map-test-1c5d7.firebaseapp.com",
  projectId: "map-test-1c5d7",
  storageBucket: "map-test-1c5d7.appspot.com",
  messagingSenderId: "712639544122",
  appId: "1:712639544122:web:3fa5a61c7c796d874b2e03",
  measurementId: "G-36K368ZHCE",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
