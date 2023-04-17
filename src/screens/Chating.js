import React, {
  useLayoutEffect,
  useCallback,
  useState,
  useEffect,
} from "react";
import Background from "../components/Background";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import {
  GiftedChat,
  InputToolbar,
  SystemMessage,
} from "react-native-gifted-chat";
import BackButton from "../components/BackButton";
import { getUserData } from "../config/cloud";
import { Avatar } from "react-native-elements";
export default function Chating({ navigation, route }) {
  const [chatId, setChatId] = useState(route.params?.paramKey);
  const [profile, setProfile] = useState({
    apartments: [],
    denominator: 0,
    email: route.params?.paramKeyEmail,
    image: "",
    isActive: false,
    name: "https://firebasestorage.googleapis.com/v0/b/exchange-of-holiday-apar-45a07.appspot.com/o/image.png?alt=media&token=6eece138-9574-479e-a1c7-cf3316a88eda",
    numerator: 0,
    personalID: "",
    phoneNumber: "",
  });
  async function handleRefresh() {
    await getUserData()
      .then((profile) => {
        console.log("profile is ", profile);
        if (profile == "") {
          console.log("sign out function required !");
        } else {
          setProfile(profile);
          // setId({ value: profile.personalID, error: "" });
          // setName({ value: profile.name, error: "" });
          // setPhoneNumber({
          //   value: profile.phoneNumber,
          //   error: "",
          // });
          // setImage(profile.image);
        }
      })
      .catch((error) => {
        // setAlertTitle("Error");
        // setAlertContent(error.message);
        // setIsAlertVisible(true);
      });
  }
  const [messages, setMessages] = useState([]);
  const signOutNow = () => {
    console.log("pressed");
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ marginLeft: 20, justifyContent: "center" }}
            onPress={navigation.goBack}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../assets/arrow_back.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => {
              navigation.navigate("OwnerDetails", {
                paramKey: route.params?.paramKeyProfile,
              });
            }}
          >
            <Avatar
              size="medium"
              rounded
              source={{
                uri: route.params?.paramKeyImage,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      title: route.params?.paramKeyName,
      // headerRight: () => (
      //   <TouchableOpacity
      //     style={{
      //       borderWidth: 5,
      //       marginRight: 10,
      //     }}
      //     onPress={signOutNow}
      //   >
      //     <Text>logout</Text>
      //   </TouchableOpacity>
      // ),
    });
    const q = query(collection(db, chatId), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) =>
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    handleRefresh();
    setMessages([
      {
        _id: 1,
        text: "Hello user",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chat screen",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];

    addDoc(collection(db, chatId), { _id, createdAt, text, user });
  }, []);
  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          // height: "90",
          backgroundColor: "white",
          // borderTopColor: "#E8E8E8",
          // borderTopWidth: 1,
          // marginTop: 30,
          // borderWidth: 1,
        }}
      />
    );
  };
  const customSystemMessage = (props) => {
    return (
      <View style={{ borderWidth: 5 }}>
        <Icon name="lock" color="#9d9d9d" size={50} />
        <Text style={styles.ChatMessageSystemMessageText}>
          Your chat is secured. Remember to be cautious about what you share
          with others.
        </Text>
      </View>
    );
  };
  return (
    // <Background style={{ width: "100%" }}>
    // <BackButton goBack={navigation.goBack} />

    // {/*start your code here*/}
    // {/* <View style={{ width: "100%" }}> */}
    <GiftedChat
      // style={{ width: "100%" }}
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      renderInputToolbar={(props) => customtInputToolbar(props)}
      renderSystemMessage={(props) => customSystemMessage(props)}
      user={{
        _id: profile.email,
        name: profile.name,
        avatar: profile.image,
      }}
    />
    // {/* </View> */}
    // </Background>
  );
}
const styles = StyleSheet.create({});
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
