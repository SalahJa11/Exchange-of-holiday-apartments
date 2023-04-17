// import React, {
//   useLayoutEffect,
//   useCallback,
//   useState,
//   useEffect,
// } from "react";
// import Background from "../components/Background";
// import { auth, db } from "../config/firebase";
// import { signOut } from "firebase/auth";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";
// import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import { GiftedChat } from "react-native-gifted-chat";
// import BackButton from "../components/BackButton";
// import { getUserData } from "../config/cloud";
// import { Avatar } from "react-native-elements";
// export default function Chat({ navigation }) {
//   const [profile, setProfile] = useState({
//     apartments: [],
//     denominator: 0,
//     email: "example@example.example",
//     image: "",
//     isActive: false,
//     name: "",
//     numerator: 0,
//     personalID: "",
//     phoneNumber: "",
//   });
//   async function handleRefresh() {
//     getUserData()
//       .then((profile) => {
//         console.log("profile is ", profile);
//         if (profile == "") {
//           console.log("sign out function required !");
//         } else {
//           setProfile(profile);
//           // setId({ value: profile.personalID, error: "" });
//           // setName({ value: profile.name, error: "" });
//           // setPhoneNumber({
//           //   value: profile.phoneNumber,
//           //   error: "",
//           // });
//           // setImage(profile.image);
//         }
//       })
//       .catch((error) => {
//         // setAlertTitle("Error");
//         // setAlertContent(error.message);
//         // setIsAlertVisible(true);
//       });
//   }
//   const [messages, setMessages] = useState([]);
//   const signOutNow = () => {
//     signOut(auth)
//       .then(() => {
//         // Sign-out successful.
//         navigation.replace("Login");
//       })
//       .catch((error) => {
//         // An error happened.
//       });
//   };
//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => (
//         <View style={{ marginLeft: 20 }}>
//           <Avatar
//             rounded
//             source={{
//               uri: profile.image,
//             }}
//           />
//         </View>
//       ),
//       headerRight: () => (
//         <TouchableOpacity
//           style={{
//             marginRight: 10,
//           }}
//           onPress={signOutNow}
//         >
//           <Text>logout</Text>
//         </TouchableOpacity>
//       ),
//     });
//     const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
//     const unsubscribe = onSnapshot(q, (snapshot) =>
//       setMessages(
//         snapshot.docs.map((doc) => ({
//           _id: doc.data()._id,
//           createdAt: doc.data().createdAt.toDate(),
//           text: doc.data().text,
//           user: doc.data().user,
//         }))
//       )
//     );

//     return () => {
//       unsubscribe();
//     };
//   }, [navigation]);

//   useEffect(() => {
//     handleRefresh();
//     setMessages([
//       {
//         _id: 1,
//         text: "Hello developer",
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: "React Native",
//           avatar: "https://placeimg.com/140/140/any",
//         },
//       },
//     ]);
//   }, []);
//   const onSend = useCallback((messages = []) => {
//     setMessages((previousMessages) =>
//       GiftedChat.append(previousMessages, messages)
//     );
//     const { _id, createdAt, text, user } = messages[0];

//     addDoc(collection(db, "chats"), { _id, createdAt, text, user });
//   }, []);
//   return (
//     // <Background style={{ width: "100%" }}>
//     // <BackButton goBack={navigation.goBack} />

//     // {/*start your code here*/}
//     // {/* <View style={{ width: "100%" }}> */}
//     <GiftedChat
//       style={{ width: "100%" }}
//       messages={messages}
//       showAvatarForEveryMessage={true}
//       onSend={(messages) => onSend(messages)}
//       user={{
//         _id: profile.email,
//         name: profile.name,
//         avatar: profile.image,
//       }}
//     />
//     // {/* </View> */}
//     // </Background>
//   );
// }
// const styles = StyleSheet.create({});
