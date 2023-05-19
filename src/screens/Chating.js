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
import { getMyEmail, getUserData } from "../config/cloud";
import { Avatar } from "react-native-elements";
import { Images, theme } from "../core/theme";
export default function Chating({ navigation, route }) {
  const [chatId, setChatId] = useState(route.params?.paramKey);
  // const profile = getUserData();
  const [profile, setProfile] = useState({
    email: route.params?.paramKeyEmail,
    image: route.params?.paramKeyImage,
    name: route.params?.paramKeyName,
  });
  // getUserData().then(() => {
  //   console.log(
  //     "getUserData()",
  //     getUserData().then((res) => {
  //       // setProfile({ ...profile, image: res.image, name: res.name });
  //       // console.log("getUserData().res", res);
  //     })
  //   );
  // });

  // async function handleRefresh() {
  //   await getUserData()
  //     .then((profile) => {
  //       console.log("profile is ", profile);
  //       if (profile == "") {
  //         console.log("sign out function required !");
  //       } else {
  //         setProfile(profile);
  //       }
  //     })
  //     .catch((error) => {});
  // }
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
    getUserData().then((res) => {
      setProfile({ ...profile, image: res.image, name: res.name });
      console.log("getUserData().res", res);
    });

    setMessages([
      {
        _id: "1",
        text: "Loading ...",
        createdAt: new Date(),
        user: {
          _id: "2",
          name: "Loading",
          avatar: Images.profile,
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
      showAvatarForEveryMessage={false}
      onSend={(messages) => onSend(messages)}
      renderInputToolbar={(props) => customtInputToolbar(props)}
      renderSystemMessage={(props) => customSystemMessage(props)}
      renderBubble={renderBubble}
      user={{
        _id: getMyEmail(),
        name: profile.name,
        avatar: profile.image,
      }}
    />
  );
}
const styles = StyleSheet.create({});
