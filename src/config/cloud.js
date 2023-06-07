import { db, auth, storage, firestore } from "./firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import {
  collection,
  setDoc,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { deleteObject } from "firebase/storage";
import {
  setPersistence,
  signInWithRedirect,
  inMemoryPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import { googleDateToJavaDate } from "../helpers/DateFunctions";
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
      image:
        "https://firebasestorage.googleapis.com/v0/b/apartments-exhange.appspot.com/o/images%2Fprofile.png?alt=media&token=416159d6-ec1f-4bfa-8e15-8bf014324b56",
      apartments: [],
      chatsId: [],
      bookings: [],
      ratedBy: [],
    });

    return userID;
  } catch (error) {
    // console.error(error);
    // console.error(error.message);
    throw new Error(error.message);
  }
}
export async function serverTime() {
  return await serverTimestamp();
}
export async function getApartmentAllRates(id) {
  const docRef = doc(db, "apartments", id);
  const res = await getDoc(docRef);
  return [...res.data().ratedBy];
}
export async function getUserAllRates(id) {
  const docRef = doc(db, "users", id);
  const res = await getDoc(docRef);
  console.log(res.data(), id);
  return [...res.data().ratedBy];
}
export async function getMyOldUserRating(userId) {
  const user = auth.currentUser;
  const Id = user.uid;
  try {
    const allRatings = await getUserAllRates(userId);
    const oldRate = allRatings.find((rate) => rate.id == Id);
    if (oldRate !== undefined)
      return { rate: oldRate.rate, comment: oldRate.comment };
    return -1;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getMyOldApartmentRating(apartmentId) {
  const user = auth.currentUser;
  const Id = user.uid;
  try {
    const allRatings = await getApartmentAllRates(apartmentId);
    // console.log("allRatings = ", allRatings);
    const oldRate = allRatings.find((rate) => rate.id == Id);
    if (oldRate !== undefined)
      return { rate: oldRate.rate, comment: oldRate.comment };
  } catch (error) {
    throw new Error(error.message);
  }
  return -1;
}
export async function rateApartmentAndUser(
  userId,
  apartmentId,
  userRate,
  apartmentRate,
  userComment,
  apartmentComment
) {
  const user = auth.currentUser;
  const Id = user.uid;
  try {
    const userData = await getUserData();
    const userImage = userData.image;
    console.log("userImage = ", userImage);
    async function removeAndUnion(object, object2, collection, id) {
      await updateDoc(doc(db, collection, id), {
        ratedBy: arrayRemove(object),
      }).then(async () => {
        await updateDoc(doc(db, collection, id), {
          ratedBy: arrayUnion(object2),
        });
      });
    }
    let userRateNumber = parseInt(userRate);
    let apartmentRateNumber = parseInt(apartmentRate);
    let allUserRates = await getUserAllRates(userId);

    if (
      userRateNumber <= 5 &&
      userRateNumber >= 1 &&
      apartmentRateNumber <= 5 &&
      apartmentRateNumber >= 1
    ) {
      const userOldRate = allUserRates.find((rate) => rate.id == Id);
      if (userOldRate !== undefined) {
        removeAndUnion(
          userOldRate,
          {
            id: Id,
            image: userImage !== undefined ? userImage : "",
            rate: userRateNumber,
            comment: userComment,
          },
          "users",
          userId
        );
      } else {
        await updateDoc(doc(db, "users", userId), {
          ratedBy: arrayUnion({
            id: Id,
            image: userImage !== undefined ? userImage : "",
            rate: userRateNumber,
            comment: userComment,
          }),
        });
      }
      if (apartmentId != "") {
        let allApartmentRates = await getApartmentAllRates(apartmentId);
        let apartmentOldRate = allApartmentRates.find((rate) => rate.id == Id);
        if (apartmentOldRate !== undefined) {
          removeAndUnion(
            apartmentOldRate,
            {
              id: Id,
              image: userImage !== undefined ? userImage : "",
              rate: apartmentRateNumber,
              comment: apartmentComment,
            },
            "apartments",
            apartmentId
          );
          apartmentOldRate.rate = apartmentRateNumber;
          await updateDoc(doc(db, "apartments", apartmentId), {
            Rating: extractRating([...allApartmentRates]),
          });
        } else {
          await updateDoc(doc(db, "apartments", apartmentId), {
            ratedBy: arrayUnion({
              id: Id,
              image: userImage !== undefined ? userImage : "",
              rate: apartmentRateNumber,
              comment: apartmentComment,
            }),
            Rating: extractRating([
              ...allApartmentRates,
              {
                id: Id,
                image: userImage !== undefined ? userImage : "",
                rate: apartmentRateNumber,
                comment: apartmentComment,
              },
            ]),
          });
        }
      }
    } else {
      throw new Error("Please enter a valid rating value");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function confirmABooking(
  bookingId,
  apartment1Id,
  apartment2Id,
  fromDate,
  toDate
) {
  console.log("falseDates = >", fromDate, toDate);
  try {
    const DBBooking = await getBookingById(bookingId);
    if (DBBooking.cancelled) throw new Error("Booking got already cancelled");

    if (apartment1Id != "") {
      const apart1 = await getValidApartmentById(apartment1Id);
      if (apart1.booked)
        throw new Error("can't make a booking with already booked apartment");
    }
    const apart2 = await getValidApartmentById(apartment2Id);
    if (apart2.booked)
      throw new Error("can't make a booking with already booked apartment");
    await updateDoc(doc(db, "bookings", bookingId), {
      confirmed: true,
    });
    if (apartment1Id != "")
      await updateDoc(doc(db, "apartments", apartment1Id), {
        booked: true,
        bookingId: bookingId,
        FromDate: new Date(fromDate),
        ToDate: new Date(toDate),
      });
    await updateDoc(doc(db, "apartments", apartment2Id), {
      booked: true,
      bookingId: bookingId,
      FromDate: new Date(fromDate),
      ToDate: new Date(toDate),
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function cancelABooking(bookingId) {
  try {
    await updateDoc(doc(db, "bookings", bookingId), {
      cancelled: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function removeABooking(bookingId, deletion = false) {
  // if (!otherUserId) throw new Error("The other user no assigned");
  const user = auth.currentUser;
  const Id = user.uid;
  try {
    await updateDoc(doc(db, "users", Id), {
      bookings: arrayRemove(bookingId),
    });
    if (deletion) await deleteDoc(doc(db, "bookings", bookingId));
    else
      await updateDoc(doc(db, "bookings", bookingId), {
        cancelled: true,
        toDelete: true,
      });
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getBookingById(id) {
  try {
    const docRef = doc(db, "bookings", id);
    const res = await getDoc(docRef);
    return { ...res.data(), bookingId: id };
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getMyBookings() {
  try {
    const profile = await getUserData();
    const bookings = profile.bookings;
    const promises = bookings.map(async (id) => {
      const docRef = doc(db, "bookings", id);
      const res = await getDoc(docRef);
      return { ...res.data(), bookingId: id };
    });
    const finalResult = await Promise.all(promises);
    console.log("final result =>", finalResult);
    return finalResult;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function isValidBooking(ownerId, ownerApartment, myApartmentId) {
  let temp = new Date().setHours(0, 0, 0, 0);
  const user = auth.currentUser;
  const Id = user.uid;
  console.log(Id, ownerId, ownerApartment, myApartmentId);
  try {
    const myAllBookings = await getMyBookings();
    console.log("myAllBookings", myAllBookings);
    const booking = myAllBookings.find(
      (booking) =>
        (booking._id2 == ownerId || booking._id2 == Id) &&
        (booking._id1 == Id || booking._id1 == ownerId) &&
        (booking._id2Apartment == ownerApartment ||
          booking._id2Apartment == myApartmentId) &&
        (booking._id1Apartment == ownerApartment ||
          booking._id1Apartment == myApartmentId) &&
        new Date(googleDateToJavaDate(booking.ToDate)).setHours(0, 0, 0, 0) >=
          temp
    );
    if (booking) {
      console.log("Found!");
      return false;
    }
    return true;
  } catch (error) {
    throw Error(error.message);
  }
}
export async function StartABooking(
  ownerId,
  ownerApartment,
  ownerApartmentImage,
  isMoney,
  myApartmentId,
  myApartmentImage,
  moneyAmount,
  fromDate,
  toDate,
  form
) {
  const user = auth.currentUser;
  const Id = user.uid;
  let result = Id.localeCompare(ownerId);
  console.log("form  = ", form);
  if (result == 0) throw new Error("Cant make a booking with yourself");
  if (form === "cash") myApartmentId = "";
  else if (form === "apartment") moneyAmount = "0";
  try {
    const Valid = await isValidBooking(ownerId, ownerApartment, myApartmentId);
    if (!Valid) {
      console.log("notValid");
      console.log("Remove old booking first");
      throw new Error("Remove old booking first");
    }
    const ap1 = await getValidApartmentById(ownerApartment);
    if (ap1.booked) throw new Error("Cant book already booked apartment");
    if (myApartmentId != "") {
      const myAp = await getValidApartmentById(myApartmentId);
      if (myAp.booked) throw new Error("Cant book already booked apartment");
    }

    const docRef = await addDoc(collection(db, "bookings"), {
      _id2: ownerId,
      _id2Apartment: ownerApartment,
      _id2ApartmentImage: ownerApartmentImage,
      _id1: Id,
      _id1Apartment: myApartmentId,
      _id1ApartmentImage: myApartmentImage,
      FromDate: new Date(fromDate),
      ToDate: new Date(toDate),
      createdAt: new Date(),
      Money: moneyAmount,
      byMoney: isMoney,
      confirmed: false,
      cancelled: false,
      toDelete: false,
      form: form,
    });
    let docId = docRef.id;
    console.log("Document written with ID: ", docRef.id);
    await updateDoc(doc(db, "users", Id), {
      bookings: arrayUnion(docId),
    });
    await updateDoc(doc(db, "users", ownerId), {
      bookings: arrayUnion(docId),
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
export function getChatId(otherUserId) {
  const user = auth.currentUser;
  const Id = user.uid;
  let newChatId = "z ";
  if (Id === otherUserId) {
    throw new Error("Can't create a chat with the yourself");
  } else if (Id > otherUserId) newChatId += Id + " " + otherUserId;
  else newChatId += otherUserId + " " + Id;
  return newChatId;
}
export function getApartmentChatId(otherApartmentId) {
  const user = auth.currentUser;
  const Id = user.uid;
  let newChatId = "x ";
  let result = Id.localeCompare(otherApartmentId);
  if (result == 0) {
    throw new Error("Can't create a chat with the yourself");
  } else if (result > 0) newChatId += Id + " " + otherApartmentId;
  else newChatId += otherApartmentId + " " + Id;
  return newChatId;
}
export async function startAChat(otherUserId) {
  const user = auth.currentUser;
  const Id = user.uid;
  let newChatId = getChatId(otherUserId);
  const UserProfile = await getUserData();
  if (UserProfile.chatsId.includes(newChatId)) return newChatId;
  await updateDoc(doc(db, "users", Id), {
    chatsId: arrayUnion(newChatId),
  });
  await updateDoc(doc(db, "users", otherUserId), {
    chatsId: arrayUnion(newChatId),
  });
  return newChatId;
}
export function getMyId() {
  const user = auth.currentUser;
  const Id = user.uid;
  return Id;
}
export function getMyEmail() {
  return auth.currentUser.email;
}
export async function getChatingWithPeople() {
  const user = auth.currentUser;
  // console.log("user", user.email);
  const Id = user.uid;
  const UserProfile = await getUserData();
  const chats = UserProfile.chatsId;
  let usersIds = [];
  chats.forEach((chatId) => {
    let users = chatId.split(" ");
    if (users[1] === Id) usersIds.push(users[2]);
    else usersIds.push(users[1]);
  });
  let finalResult = await Promise.all(
    usersIds.map(async (id) => {
      let temp = await getApartmentOwner(id);
      return { ...temp, id: id };
    })
  );
  return finalResult;
}
export async function getApartmentOwner(userId) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let result = docSnap.data();
    return {
      ...docSnap.data(),
      Rating: extractRating(result.ratedBy),
      userId: userId,
    };
  } else {
    throw new Error("No such user");
    // console.log("No such document!");
  }
}
export async function getAllListedApartments() {
  const finalResult = [];
  try {
    const nowDate = Timestamp.fromDate(new Date());
    const q = query(
      collection(db, "apartments"),
      where("ToDate", ">", nowDate)
    );

    const querySnapshot = await getDocs(q);
    console.log("querySnapshot = ", querySnapshot);
    querySnapshot.forEach((doc) => {
      let apartmentId = doc.id;
      console.log(doc.id, " => ", doc.data());
      if (doc.data().Listed && !doc.data().booked)
        finalResult.push({ ...doc.data(), apartmentId: apartmentId });
    });
  } catch (error) {
    throw new Error(error.message);
  }
  return finalResult;
}
function extractRating(array) {
  let sum = 0;
  array.forEach((object) => {
    object.rate > 0 ? (sum += object.rate) : (sum = sum);
  });
  let result = array.length > 0 ? sum / array.length : 0;
  console.log(result, array);
  return result;
}
export async function getValidApartmentById(id) {
  let temp = new Date().setHours(0, 0, 0, 0);
  try {
    const docRef = doc(db, "apartments", id);
    const res = await getDoc(docRef);
    if (res.exists()) {
      let result = res.data();
      if (result.booked) {
        console.log(
          "checking booked apartment",
          result.ToDate,
          googleDateToJavaDate(result.ToDate)
        );
        console.log(
          new Date(googleDateToJavaDate(result.ToDate)).setHours(0, 0, 0, 0) <
            temp,
          new Date(googleDateToJavaDate(result.ToDate)).setHours(0, 0, 0, 0),
          temp
        );
        if (
          new Date(googleDateToJavaDate(result.ToDate)).setHours(0, 0, 0, 0) <
          temp
        ) {
          console.log("fixing booked apartment");
          await updateDoc(doc(db, "apartments", id), {
            booked: false,
            bookingId: "",
          });
          return await getValidApartmentById(id);
        }
      }
      return {
        ...result,
        apartmentId: id,
        Rating: extractRating(result.ratedBy),
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getMyApartments() {
  try {
    const profile = await getUserData();
    const apartments = profile.apartments;
    const promises = apartments.map(async (id) => {
      return await getValidApartmentById(id);
    });
    const finalResult = await Promise.all(promises);
    console.log("final result =>", finalResult);
    return finalResult;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getOwnerListedApartments(apartmentsId) {
  function isListed(value) {
    return value.Listed;
  }
  try {
    const apartments = apartmentsId;
    const promises = apartments.map(async (id) => {
      return await getValidApartmentById(id);
    });
    const finalResult = await Promise.all(promises);
    console.log("final result =>", finalResult);
    return finalResult.filter(isListed);
  } catch (error) {
    throw new Error(error.message);
  }
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
  belcony,
  toDeleteImages
) {
  console.log("toDeleteImages", toDeleteImages);
  const user = auth.currentUser;
  const Id = user.uid;
  try {
    console.log("done-1");

    const toDeleteApartment = await getValidApartmentById(apartmentId);
    if (toDeleteApartment.booked) {
      throw new Error("Cant edit booked apartment");
    }
    console.log("done0");

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
    for (const uri of toDeleteImages) {
      const imageRef = ref(storage, uri);
      console.log("imageRef", imageRef);
      await deleteObject(imageRef).then(() => {
        console.log("Image deleted successfully");
      });
    }
  } catch (error) {
    throw new Error(error.message);
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
    const toDeleteApartment = await getValidApartmentById(apartmentId);
    if (toDeleteApartment.booked) {
      throw new Error("Cant remove booked apartment");
    }
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
      createdAt: new Date(),
      Rating: 0,
      bookingId: "",
      Listed: false,
      booked: false,
      ratedBy: [],
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
    profile.image = await uploadImageAsync(Id, profile.imageAssets);
  }
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
  ).catch((error) => {
    throw Error(error.message);
  });
}
export async function passwordRecoveryEmail(email) {
  const auth = getAuth();

  await sendPasswordResetEmail(auth, email)
    .then(() => {
      return true;
    })
    .catch((error) => {
      const errorMessage = error.message;
      throw new Error(errorMessage);
      // ..
    });
}
export async function logIn(email, password) {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("singedInUserCredentials", user);
      // return true;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      if (errorCode === "auth/user-not-found")
        throw new Error("Invalid Email or Password");
      throw new Error(error.message);
      // return error;
    });
}
export async function getUserData() {
  const user = auth.currentUser;
  const Id = user.uid;
  const docRef = doc(db, "users", Id);
  const docSnap = await getDoc(docRef);
  // console.log(docSnap.data());
  if (docSnap.exists()) {
    let result = docSnap.data();
    return { ...result, Rating: extractRating(result.ratedBy) };
  }
  signOutUser();
}
export async function signOutUser() {
  await signOut(auth)
    .then(() => {
      return true;
    })
    .catch((error) => {
      // console.error(error);
      throw Error(error.message);
    });
}
export async function getAllUsers() {
  const user = auth.currentUser;
  const Id = user.uid;
  let finalResult = [];
  try {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    console.log("querySnapshot = ", querySnapshot);
    querySnapshot.forEach((doc) => {
      let userId = doc.id;
      console.log(doc.id, " => ", doc.data());
      if (userId !== Id) finalResult.push({ ...doc.data(), id: userId });
    });
    return finalResult;
  } catch (error) {
    throw new Error(error.message);
  }
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
  // console.log("returning as icon => ", profileIcon);
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
