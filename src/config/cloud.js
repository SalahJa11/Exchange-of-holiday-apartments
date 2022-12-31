import { db, auth, storage } from "./firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
// import { auth } from "firebase/auth";
import { useState } from "react";
import { async } from "@firebase/util";
// import "firebase/firestore";
// import { ref, getDownloadURL, uploadBytesResumable, uploadBytes, getStorage, deleteObject } from "firebase/storage";
// import { Alert } from "react-native";
// import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import {
  collection,
  setDoc,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  increment,
  query,
  orderBy,
  where,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateCurrentUser,
} from "firebase/auth";
// import * as firebase from "firebase";
/**
 *
 * @param {*} userName
 * @param {*} userEmail
 * @param {*} userPhoneNumber
 * @param {*} userDateCreated
 * @param {*} userIdNumber
 */
export async function createNewUser(
  userEmail,
  password,
  displayName,
  userPersonalID,
  phoneNumber
) {
  //   console.log(userEmail, password, displayName, userPersonalID, phoneNumber);
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      userEmail,
      password
    );
    const userID = user.uid;
    await setDoc(doc(db, "users", userID), {
      name: displayName,
      email: userEmail,
      personalID: userPersonalID,
      phoneNumber: phoneNumber,
      numerator: 0,
      denominator: 0,
      isActive: true,
      image: "",
      apartments: [],
    });

    return userID;
  } catch (error) {
    console.error(error);
    console.error(error.message);
    throw Error(error.message);
  }
}
export async function getAllListedApartments() {
  let finalResult = [];
  try {
    const q = query(collection(db, "apartments"), where("Listed", "==", true));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      finalResult.push(doc.data());
    });
  } catch (error) {
    throw Error(error.message);
  }
  return finalResult;
}
export async function getMyApartments() {
  try {
    const profile = await getUserData();
    const apartments = profile.apartments;
    const promises = apartments.map(async (id) => {
      const docRef = doc(db, "apartments", id);
      const res = await getDoc(docRef);
      return { ...res.data(), apartmentId: id };
    });
    const finalResult = await Promise.all(promises);
    console.log("final result =>", finalResult);
    return finalResult;
  } catch (error) {}
}
export async function editApartment(
  apartmentId,
  rooms,
  bedrooms,
  bathrooms,
  kitchens,
  name,
  description,
  images,
  mainImage,
  imageAssets,
  fromDate,
  toDate,
  listed,
  belcony
) {
  const user = auth.currentUser;
  const Id = user.uid;
  try {
    let time = new Date().getTime();
    if (!(imageAssets.length === 0)) {
      let imagesUri = [];
      for (let i = 0; i < imageAssets.length; i++) {
        imagesUri.push(
          await uploadImageAsync(
            `apartments/${apartmentId}/${i}-${time}`,
            imageAssets[i]
          )
        );
      }
      console.log("done1");
      await updateDoc(doc(db, "apartments", apartmentId), {
        Images: [],
      });
      console.log("done2");
      await updateDoc(doc(db, "apartments", apartmentId), {
        Images: [...imagesUri, ...images],
      });
      console.log("done3");
    }
    await updateDoc(doc(db, "apartments", apartmentId), {
      Rooms: rooms,
      Bedrooms: bedrooms,
      Bathrooms: bathrooms,
      Kitchens: kitchens,
      Name: name,
      Description: description,
      Image: mainImage,
      Belcony: belcony,
      FromDate: new Date(fromDate),
      ToDate: new Date(toDate),
      Listed: listed,
    });
    console.log("done4");
  } catch (error) {
    console.log(error);
  }
}
export async function listApartment(apartmentId, toList) {
  const user = auth.currentUser;
  const Id = user.uid;
  try {
    await updateDoc(doc(db, "apartments", apartmentId), {
      Listed: toList,
    });
  } catch (error) {
    console.log(error);
  }
}
export async function removeApartment(apartmentId) {
  const user = auth.currentUser;
  const Id = user.uid;
  try {
    await updateDoc(doc(db, "users", Id), {
      apartments: arrayRemove(apartmentId),
    });
    await deleteDoc(doc(db, "apartments", apartmentId));
  } catch (error) {
    throw Error(error.message);
  }
}
export async function addANewApartment(
  type,
  rooms,
  bedrooms,
  bathrooms,
  kitchens,
  name,
  description,
  location,
  imageAssets,
  belcony,
  fromDate,
  toDate
) {
  const user = auth.currentUser;
  const Id = user.uid;
  try {
    const docRef = await addDoc(collection(db, "apartments"), {
      Owner: Id,
      Type: type,
      Rooms: rooms,
      Bedrooms: bedrooms,
      Bathrooms: bathrooms,
      Kitchens: kitchens,
      Name: name,
      Description: description,
      Location: location,
      Images: [],
      Image: "",
      Belcony: belcony,
      FromDate: new Date(fromDate),
      ToDate: new Date(toDate),
      numerator: 0,
      denominator: 0,
      RentHistory: [],
      Listed: false,
    });
    let docId = docRef.id;
    console.log("Document written with ID: ", docRef.id);
    if (!(imageAssets.length === 0)) {
      let imagesUri = [];
      for (let i = 0; i < imageAssets.length; i++) {
        imagesUri.push(
          await uploadImageAsync(`apartments/${docId}/${i}`, imageAssets[i])
        );
      }
      await updateDoc(doc(db, "apartments", docId), {
        Images: imagesUri,
        Image: imagesUri[0],
      });
      await updateDoc(doc(db, "users", Id), {
        apartments: arrayUnion(docId),
      });
    }
  } catch (error) {
    throw Error(error.message);
  }
}

export async function updateUserProfile(profile) {
  console.log("updateUserProfile, ", profile);
  const user = auth.currentUser;
  const Id = user.uid;
  let setImage = false;
  if (!(Object.keys(profile.imageAssets).length === 0)) {
    setImage = true;
    await uploadImageAsync(Id, profile.imageAssets)
      .then(async (uri) => {
        profile.image = uri;
        await updateDoc(
          doc(db, "users", Id),
          setImage
            ? {
                name: profile.name,
                personalID: profile.personalID,
                phoneNumber: profile.phoneNumber,
                image: profile.image,
              }
            : {
                name: profile.name,
                personalID: profile.personalID,
                phoneNumber: profile.phoneNumber,
              }
        )
          .then()
          .catch((error) => {
            throw Error(error.message);
          });
      })
      .catch((error) => {
        throw Error(error.message);
      });
  }
}
export async function logIn(email, password) {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("singedInUserCredentials", user);
      return true;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw Error(error.message);
      // return error;
    });
}
export async function getUserData() {
  const user = auth.currentUser;
  const Id = user.uid;
  const docRef = doc(db, "users", Id);
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data());
  if (docSnap.exists()) {
    return docSnap.data();
  }
  signOutUser();
  return "";
}
export async function signOutUser() {
  await signOut(auth)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      throw Error(error.message);
    });
}
export async function uploadProfileImageToDatabase(id, image) {
  let extention = /[.]/.exec(image);
  const storageRef = ref(storage, `images/${id}`);
  const snapshot = await storageRef.put(image);
  // Get the download URL for the image
  const downloadURL = await snapshot.ref.getDownloadURL();

  // Return the download URL
  return downloadURL;
}
export async function uploadImageToDatabase(file) {
  const metadata = {
    contentType: "image/jpeg",
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, "images/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  console.log("receivedFile = ", file);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
      });
    }
  );
}
export async function uploadImageAsync(id, file) {
  // let extention = file.uri.split(".").pop();
  console.log("file", file);
  let uri = file.uri;
  console.log(12);
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(storage, `images/${id}`);
  const result = await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();
  let temp = await getDownloadURL(fileRef);
  console.log("temp =", temp);
  return temp;
}
export async function getProfileIcon() {
  const storageRef = ref(storage);
  const profileIcon = await ref(storageRef, "profile.png");
  console.log("returning as icon => ", profileIcon);
  return profileIcon;
}
// export async function handleSignUp(email, password) {
//   try {
//     const response = await firebase
//       .auth()
//       .createUserWithEmailAndPassword(email, password);

//     console.log(response.user.email);
//   } catch (error) {
//     console.error(error);
//   }
// }
