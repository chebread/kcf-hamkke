import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: 'AIzaSyBe-F52wzc3CG0r8bBKCK9buDIi7SMlcII',
  authDomain: 'hamkke-b1ee1.firebaseapp.com',
  projectId: 'hamkke-b1ee1',
  storageBucket: 'hamkke-b1ee1.appspot.com',
  messagingSenderId: '551607596699',
  appId: '1:551607596699:web:be65c7357c77abe955783e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
