import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
    getFirestore 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getAuth,
    setPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCwnV4AVN_sjSmuobmer0jKLpVqNZX7Gzs",
    authDomain: "phosory.firebaseapp.com",
    projectId: "phosory",
    storageBucket: "phosory.firebasestorage.app",
    messagingSenderId: "582612122852",
    appId: "1:582612122852:web:32edb719cf6f1ffd8a40f1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

/* Session lasts only while browser session exists */

setPersistence(
    auth,
    browserSessionPersistence
)
.then(() => {

    console.log(
        "Session persistence enabled"
    );

})
.catch((err) => {

    console.error(
        "Persistence error:",
        err
    );

});