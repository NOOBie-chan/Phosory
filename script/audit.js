import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function log(admin, action, type) {

  await addDoc(collection(db, "activityLogs"), {
    admin,
    action,
    type,
    timestamp: serverTimestamp()
  });
}

function logAction(action){
  db.audit.unshift({
    action,
    time: new Date().toLocaleString(),
    type: action.includes("login") ? "auth" : "system"
  });

  save();
}