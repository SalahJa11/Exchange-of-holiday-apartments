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
  Bubble,
  GiftedChat,
  InputToolbar,
  SystemMessage,
} from "react-native-gifted-chat";
import BackButton from "../components/BackButton";
import { getUserData } from "../config/cloud";
import { Avatar } from "react-native-elements";
import { theme } from "../core/theme";
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
        }
      })
      .catch((error) => {});
  }
  const [messages, setMessages] = useState([]);
  useLayoutEffect(() => {
    console.log("received", route);

    navigation.setOptions({
      headerLeft: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ marginLeft: 20, justifyContent: "center" }}
            onPress={navigation.goBack}
          >
            <Image
              style={{ width: 24, height: 24, tintColor: "white" }}
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
        text: "Loading ...",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Loading",
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/exchange-of-holiday-apar-45a07.appspot.com/o/profile.png?alt=media&token=4b2307ea-21b5-4c88-85d5-97fc8a532cc6",
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
          backgroundColor: "white",
        }}
      />
    );
  };
  const customSystemMessage = (props) => {
    return (
      <View style={{ borderWidth: 5 }}>
        <Icon name="lock" color="white" size={50} />
        <Text style={styles.ChatMessageSystemMessageText}>
          Your chat is secured. Remember to be cautious about what you share
          with others.
        </Text>
      </View>
    );
  };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: theme.colors.primary,
          },
        }}
      />
    );
  };
  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      renderInputToolbar={(props) => customtInputToolbar(props)}
      renderSystemMessage={(props) => customSystemMessage(props)}
      renderBubble={renderBubble}
      user={{
        _id: profile.email,
        name: profile.name,
        avatar: profile.image,
      }}
    />
  );
}
const styles = StyleSheet.create({});
