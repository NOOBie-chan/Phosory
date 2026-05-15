import { storage } from "./firebase.js";
import { ref, uploadBytes, getDownloadURL }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

export async function uploadFile(file) {

  const fileRef = ref(storage, "resumes/" + Date.now() + "_" + file.name);

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
}