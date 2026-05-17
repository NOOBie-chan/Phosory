import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function listenOrders(callback){

  const q =
  query(
    collection(db,"orders"),
    orderBy("createdAt","desc")
  );

  onSnapshot(q,(snapshot)=>{

    const orders = [];

    snapshot.forEach(doc=>{

      orders.push({
        id:doc.id,
        ...doc.data()
      });

    });

    callback(orders);

  });

}

export function listenDevelopers(callback){

  const q =
  query(
    collection(db,"developers"),
    orderBy("createdAt","desc")
  );

  onSnapshot(q,(snapshot)=>{

    const devs = [];

    snapshot.forEach(doc=>{

      devs.push({
        id:doc.id,
        ...doc.data()
      });

    });

    callback(devs);

  });

}

export function listenaudit_logs(callback){

  const q =
  query(
    collection(db,"audit_logs"),
    orderBy("time","desc")
  );

  onSnapshot(q,(snapshot)=>{

    const logs = [];

    snapshot.forEach(doc=>{

      logs.push({
        id:doc.id,
        ...doc.data()
      });

    });

    callback(logs);

  });

}