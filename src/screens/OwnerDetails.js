import React, { useState, useEffect } from "react";
import Background from "../components/Background";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import BackButton from "../components/BackButton";
import TextInput from "../components/TextInput";
import Error from "../components/Error";
import Note from "../components/Note";
import Processing from "../components/Processing";
import { theme } from "../core/theme";
import { nameValidator } from "../helpers/nameValidator";
import { phoneNumberValidator } from "../helpers/phoneNumberValidator";
import { idValidator } from "../helpers/idValidator";
import {
  getChatId,
  getMyId,
  getOwnerListedApartments,
  startAChat,
} from "../config/cloud";
import * as ImagePicker from "expo-image-picker";
import { googleDateToJavaDate } from "../helpers/DateFunctions";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { TOAST } from "../core/TOASTText";
import ReviewsBox from "../components/ReviewsBox";

export default function OwnerDetails({ navigation, route }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("Error");
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Note");
  const [noteContent, setNoteContent] = useState("Done");
  const [profile, setProfile] = useState(route.params?.paramKey);
  const [apartments, setApartments] = useState([]);
  console.log(
    route.params?.paramKey.Owner,
    "===",
    getMyId(),
    route.params?.paramKey
  );
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };

  const [name, setName] = useState({ value: profile.name, error: "" });
  const [phoneNumber, setPhoneNumber] = useState({
    value: profile.phoneNumber,
    error: "",
  });
  const [id, setId] = useState({ value: profile.personalID, error: "" });
  const [image, setImage] = useState(profile.image);
  const [imageAssets, setImageAssets] = useState({});
  useEffect(() => {
    fetchData();
    // setIsProcessing(false);
  }, []);
  async function fetchData() {
    // setIsProcessing(true);
    try {
      console.log(profile.apartments);
      const res = await getOwnerListedApartments(profile.apartments);
      let temp = [...res];
      temp = saveStatus(temp);
      setApartments([...temp]);
      styleHeader();
    } catch (error) {
      console.error(error);
      // setIsProcessing(false);
    }
    // setIsProcessing(false);
  }
  const styleHeader = (owner) => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 15 }}>
          {/* <Text style={{ textAlignVertical: "center" }}>
            {owner.name.slice(0, 15)}
          </Text> */}
          <TouchableOpacity
            style={{ width: 30, height: 30, marginRight: 3 }}
            onPress={() => {
              showMessage(TOAST.OwnerDetails);
            }}
          >
            <Image
              style={{ width: 30, height: 30, tintColor: "white" }}
              // rounded

              source={require("../assets/help2.png")}
            />
          </TouchableOpacity>
          {getMyId() !== profile.id && profile.id != undefined && (
            <TouchableOpacity
              onPress={async () => {
                await startAChat(profile.id).then((newChatId) => {
                  navigation.navigate("Chating", {
                    paramKey: getChatId(profile.id),
                    paramKeyEmail: profile.email,
                    paramKeyImage: profile.image,
                    paramKeyProfile: profile,
                    paramKeyName: profile.name,
                  });
                });
              }}
            >
              <Image
                source={require("../assets/message.png")}
                style={{ height: 30, width: 30, tintColor: "white" }}
              />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  };
  const saveStatus = (apartmentsArray) => {
    // console.log("apartmentsArrayLength = ", apartmentsArray.length, apartmentsArray);
    const dateTemp = new Date().setHours(0, 0, 0, 0);
    const res = apartmentsArray.map((element) => {
      let newElement = { ...element };
      if (element.booked) {
        newElement.status = "Booked";
        console.log("Booked");
      } else if (
        new Date(googleDateToJavaDate(element.ToDate)).setHours(0, 0, 0, 0) <
        dateTemp
      ) {
        newElement.status = "Expired";
        console.log("Expired");
      } else if (element.Listed) {
        newElement.status = "Listed";
        console.log("Listed");
      } else {
        newElement.status = "Not Listed";
        console.log("Not Listed");
      }
      console.log("i");
      return newElement;
    });
    // console.log(res);
    return res;
  };
  const everyHouseCard = () => {
    let result = [];
    apartments.forEach((element, index) => {
      result.push(
        <TouchableOpacity
          activeOpacity={0.8}
          key={index}
          onLongPress={() => {
            navigation.navigate("ApartmentInfo", {
              paramKey: apartments[index],
            });
          }}
          style={{
            width: "100%",
            aspectRatio: 1,
            marginVertical: 8,
          }}
        >
          <Image
            style={{
              width: "100%",
              aspectRatio: 1,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              resizeMode: "cover",
            }}
            source={{ uri: element.Image }}
          ></Image>
          {element.Name && (
            <View
              style={{
                backgroundColor: "black",
                opacity: 0.75,
                width: "100%",
                position: "relative",
                bottom: 50,
                paddingLeft: 10,
                paddingRight: 10,
                flexDirection: "row",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
            >
              <Text
                style={{
                  flex: 3,
                  height: 50,
                  fontSize: 20,
                  textAlignVertical: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {element.Name.slice(0, 30)}
              </Text>
              <Text
                style={{
                  flex: 2,
                  height: 50,
                  fontSize: 15,
                  borderLeftWidth: 3,
                  borderColor: "white",
                  textAlign: "center",
                  textAlignVertical: "center",
                  color: "white",
                }}
              >
                {"Rating "}
                {element.Rating === 0 ? "Not rated yet" : element.Rating}
                {"\n"}
                {element.status}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    });
    return result;
  };
  return (
    <Background>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-evenly" }}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              style={styles.avatar}
              source={
                image == "" ? require("../assets/profile.png") : { uri: image }
              }
            />

            <Text style={{ color: "black", fontSize: 24 }}>{profile.name}</Text>
          </View>
        </View>
        {getMyId() !== profile.id && (
          <TouchableOpacity
            style={{
              // width: "100%",
              height: 50,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              alignSelf: "center",
              // borderWidth: 1,
              padding: 2,
              marginTop: 3,

              backgroundColor: theme.colors.primaryBackground,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 17 }}>Chat</Text>
            <Image
              source={require("../assets/message.png")}
              style={{ height: 40, aspectRatio: 1 }}
            />
          </TouchableOpacity>
        )}
        <View style={styles.DetailsContainer}>
          {/* <Text style={styles.ProfileDetails}>Id: {profile.personalID}</Text> */}
          <Text style={styles.ProfileDetails}>Email: {profile.email}</Text>
          <Text style={styles.ProfileDetails}>
            Phone number: {profile.phoneNumber}
          </Text>
          <Text style={styles.ProfileDetails}>
            Rating: {profile.Rating === 0 ? "Not rated yet" : profile.Rating}
          </Text>
        </View>
        <ReviewsBox array={profile.ratedBy} navigation={navigation} />

        {everyHouseCard()}
      </ScrollView>
      <Error
        visible={errorVisible}
        title={errorTitle}
        content={errorContent}
        onPress={() => {
          toCloseError();
        }}
      />
      <Note
        visible={noteVisible}
        title={noteTitle}
        content={noteContent}
        onPress={() => {
          toCloseError();
          navigation.push("HomeScreen");
        }}
      ></Note>

      <Processing visible={isProcessing} content={"Updating..."}></Processing>
      <FlashMessage position="bottom" floating={true} />
    </Background>
  );
}
const styles = StyleSheet.create({
  ProfileDetails: {
    borderWidth: 1,
    padding: 2,
    margin: 3,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: theme.colors.primaryBackground,
    borderColor: theme.colors.primaryBorder,
    borderRadius: 5,
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
  ProfileScreen: {
    flex: 1,
    backgroundColor: "#ffffff",
    margin: 40,
    padding: 10,
    borderRadius: 10,
  },
  header: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  profilePressableButtons: {
    display: "flex",
    margin: 5,
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#fd0000",
    height: "100%",
    justifyContent: "center",
  },
  profilePressableButtons2: {
    backgroundColor: theme.colors.primary,
  },
  profilePressableButtonsView: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 5,
    justifyContent: "center",
    height: 50,
  },
});
