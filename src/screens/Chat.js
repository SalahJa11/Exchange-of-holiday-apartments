import React, { useState, useEffect } from "react";
import Background from "../components/Background";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
import BackButton from "../components/BackButton";
import { getChatId, getChatingWithPeople, getMyEmail } from "../config/cloud";
import Error from "../components/Error";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from "react-native-elements";
import { theme } from "../core/theme";
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
  const [tempChats, setTempChats] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchData();
    // setIsProcessing(false);
  }, []);
  async function fetchData() {
    // setIsProcessing(true);
    await getChatingWithPeople()
      .then((result) => {
        console.log("result is ", result);
        setChats([...result]);
        setTempChats([...result]);
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
          style={{ marginBottom: 5 }}
          key={index}
          onPress={() => {
            console.log("sending :", {
              paramKey: getChatId(user.id),
              paramKeyEmail: user.email,
              paramKeyImage: user.image,
              paramKeyProfile: user,
              paramKeyName: user.name,
            });
            navigation.navigate("Chating", {
              paramKey: getChatId(user.id),
              paramKeyEmail: user.email,
              paramKeyImage: user.image,
              paramKeyProfile: user,
              paramKeyName: user.name,
            });
          }}
        >
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
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
                width: "100%",
                textAlignVertical: "center",
                textAlign: "left",
                marginLeft: 20,
                fontSize: 16,
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
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = tempChats.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setChats(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setChats(tempChats);
      setSearch(text);
    }
  };
  return (
    <Background innerStyle={{ justifyContent: "space-between" }}>
      {/* <BackButton goBack={navigation.goBack} /> */}

      {/*start your code here*/}
      {/* <Text>its Chating page start your code here{JSON.stringify(chats)}</Text> */}

      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search Here"
      />
      <ScrollView style={{ width: "100%", height: "100%" }}>
        {listChatUsers()}
      </ScrollView>
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
const styles = StyleSheet.create({
  textInputStyle: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: theme.colors.primary,
    paddingHorizontal: 8,
    margin: 5,
    backgroundColor: "white",
  },
});
