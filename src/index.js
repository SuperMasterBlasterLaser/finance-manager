import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

const firebase = require("firebase");
require("firebase/firestore");

var config = {
  apiKey: "AIzaSyAcWanOdyrIxr-BMnKiCILWLNtbyBpXJ5M",
  authDomain: "financemanager-bad7b.firebaseapp.com",
  databaseURL: "https://financemanager-bad7b.firebaseio.com",
  projectId: "financemanager-bad7b",
  storageBucket: "financemanager-bad7b.appspot.com",
  messagingSenderId: "742643030235"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();


ReactDOM.render(<App db={db} />, document.getElementById('root'));
registerServiceWorker();
