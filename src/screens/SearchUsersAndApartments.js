import { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  getAllListedApartments,
  getAllUsers,
  getChatId,
  startAChat,
} from "../config/cloud";
import Background from "../components/Background";
import Error from "../components/Error";
import { theme } from "../core/theme";
import { Avatar } from "react-native-elements";
import Processing from "../components/Processing";

export default function SearchUsersAndApartments({ navigation, route }) {
  const type = route.params?.type;
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("error");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [dataArrayTemp, setDataArrayTemp] = useState([]);
  const [search, setSearch] = useState("");
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };
  const styleHeader = (title) => {
    navigation.setOptions({
      title: title,
    });
  };
  if (type === "users") {
    styleHeader("New conversation");
  }
  if (type === "apartments") {
    styleHeader("Available apartments");
  }
  useEffect(() => {
    // setIsProcessing(true);

    fetchData();

    // setIsProcessing(false);
  }, []);
  async function fetchData() {
    setIsProcessing(true);
    try {
      if (type === "users")
        await getAllUsers().then((res) => {
          setDataArray([...res]);
          setDataArrayTemp([...res]);
          // styleHeader("New conversation");
        });
      else if (type === "apartments")
        await getAllListedApartments().then((res) => {
          setDataArray([...res]);
          setDataArrayTemp([...res]);
          // styleHeader("Available apartments");
        });
      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  }

  const listChatUsers = () => {
    let result = [];
    dataArray.forEach((user, index) => {
      let temp = (
        <TouchableOpacity
          style={{ marginBottom: 5 }}
          key={index}
          onPress={async () => {
            await startAChat(user.id).then((newChatId) => {
              navigation.navigate("Chating", {
                paramKey: getChatId(user.id),
                paramKeyEmail: user.email,
                paramKeyImage: user.image,
                paramKeyProfile: user,
                paramKeyName: user.name,
              });
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
  const listApartments = () => {
    let result = [];
    dataArray.forEach((apartment, index) => {
      let temp = (
        <TouchableOpacity
          style={{ marginBottom: 5 }}
          key={index}
          onPress={() => {
            navigation.navigate("ApartmentInfo", {
              paramKey: apartment,
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
                uri: apartment.Image,
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
              {apartment.Name === ""
                ? "Not Named"
                : apartment.Name.length > 30
                ? apartment.Name.slice(0, 30) + "..."
                : apartment.Name}
            </Text>
          </View>
        </TouchableOpacity>
      );
      result.push(temp);
    });
    return result;
  };
  const listAll = () => {
    if (type === "users") {
      styleHeader("New conversation");
      return listChatUsers();
    }
    if (type === "apartments") {
      styleHeader("Available apartments");
      return listApartments();
    }
    return;
  };
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = dataArrayTemp.filter(function (item) {
        if (type === "apartments") item.name = item.Name;
        // Applying filter for the inserted text in search bar
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataArray(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setDataArray(dataArrayTemp);
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
        {listAll()}
      </ScrollView>
      <Error
        visible={errorVisible}
        title={errorTitle}
        content={errorContent}
        onPress={() => {
          toCloseError();
        }}
      />
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
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
  plusSignOpView: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    zIndex: 1,
  },
});
