import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function getStats() {

  const orders = await getDocs(collection(db, "orders"));
  const devs = await getDocs(collection(db, "developers"));

  let approved = 0;
  let rejected = 0;

  orders.forEach(o => {
    const d = o.data();
    if (d.status === "approved") approved++;
    if (d.status === "rejected") rejected++;
  });

  return {
    orders: orders.size,
    developers: devs.size,
    approved,
    rejected
  };
}