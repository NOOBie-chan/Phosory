import { storage }
from "./firebase.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

export async function uploadResume(file) {

  const fileName =
    Date.now() + "-" + file.name;

  const storageRef =
    ref(storage, "resumes/" + fileName);

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);

}