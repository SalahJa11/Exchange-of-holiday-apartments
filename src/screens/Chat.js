import React, { useState, useEffect } from "react";
import Background from "../components/Background";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { getChatId, getChatingWithPeople, getMyEmail } from "../config/cloud";
import Error from "../components/Error";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from "react-native-elements";
export default function Chat({ navigation }) {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("Error");
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };
  const [chats, setChats] = useState([]);
  useEffect(() => {
    fetchData();
    // setIsProcessing(false);
  }, []);
  async function fetchData() {
    // setIsProcessing(true);
    await getChatingWithPeople()
      .then((result) => {
        console.log("result is ", result);
        setChats(result);
      })
      .catch((error) => {
        setErrorTitle("Error");
        setErrorContent(error.message);
        setErrorVisible(true);
      });
  }
  const listChatUsers = () => {
    let result = [];
    chats.forEach((user, index) => {
      let temp = (
        <TouchableOpacity
          key={index}
          onPress={() => {
            navigation.navigate("Chating", {
              paramKey: getChatId(user.id),
              paramKeyEmail: getMyEmail(),
              paramKeyImage: user.image,
              paramKeyProfile: user,
              paramKeyName: user.name,
            });
          }}
        >
          <View
            style={{
              marginLeft: 20,
              flexDirection: "row",
              // justifyContent: "space-around",
            }}
          >
            <Avatar
              rounded
              size="medium"
              source={{
                uri: user.image,
              }}
            />
            <Text
              style={{
                textAlignVertical: "center",
                textAlign: "left",
                marginLeft: 20,
              }}
            >
              {user.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
      result.push(temp);
    });
    return result;
  };
  return (
    <Background innerStyle={{ justifyContent: "space-between" }}>
      {/* <BackButton goBack={navigation.goBack} /> */}

      {/*start your code here*/}
      {/* <Text>its Chating page start your code here{JSON.stringify(chats)}</Text> */}
      <View style={{ width: "100%" }}>{listChatUsers()}</View>
      <Error
        visible={errorVisible}
        title={errorTitle}
        content={errorContent}
        onPress={() => {
          toCloseError();
        }}
      />
    </Background>
  );
}
const styles = StyleSheet.create({});
