import { db } from "./firebase.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================================
   REALTIME ORDERS
================================ */

export function listenOrders(callback) {

  const q = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Realtime Orders:", orders);

    callback(orders);

  }, (err) => {
    console.error("Orders Listener Error:", err);
  });

}

/* ================================
   REALTIME DEVELOPERS
================================ */

export function listenDevelopers(callback) {

  const q = query(
    collection(db, "developers"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    const devs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Realtime Developers:", devs);

    callback(devs);

  }, (err) => {
    console.error("Developers Listener Error:", err);
  });

}