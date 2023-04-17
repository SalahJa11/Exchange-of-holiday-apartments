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
import { getOwnerListedApartments } from "../config/cloud";
import * as ImagePicker from "expo-image-picker";
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
      console.log(res);
      setApartments([...res]);
    } catch (error) {
      console.error(error);
      // setIsProcessing(false);
    }
    // setIsProcessing(false);
  }
  const everyHouseCard = () => {
    let result = [];
    apartments.forEach((element, index) => {
      result.push(
        <TouchableOpacity
          activeOpacity={0.8}
          key={index}
          onLongPress={() => {
            navigation.push("ApartmentInfo", {
              paramKey: apartments[index],
            });
          }}
          style={{
            width: "100%",
            aspectRatio: 1,
            marginTop: 18,
          }}
        >
          <Image
            style={{
              width: "100%",
              aspectRatio: 1,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              resizeMode: "cover",
            }}
            source={{ uri: element.Image }}
          ></Image>
          {element.Name && (
            <View
              style={{
                backgroundColor: "white",
                opacity: 0.75,
                width: "100%",
                position: "relative",
                bottom: 50,
                paddingLeft: 5,
                paddingRight: 5,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  flex: 3,
                  height: 50,
                  fontSize: 20,
                  textAlignVertical: "center",
                }}
              >
                {element.Name}
              </Text>
              <Text
                style={{
                  flex: 2,
                  height: 50,
                  fontSize: 15,
                  borderLeftWidth: 3,
                  textAlign: "center",
                  textAlignVertical: "center",
                  color: "black",
                }}
              >
                {"Rating "}
                {element.Rating}
                {/* {element.Listed ? "Listed" : "Not listed"} */}
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
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
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

            <Text style={styles.name}>{profile.name}</Text>
          </View>
        </View>
        <View style={styles.DetailsContainer}>
          <Text style={styles.ProfileDetails}>Id: {profile.personalID}</Text>
          <Text style={styles.ProfileDetails}>Email: {profile.email}</Text>
          <Text style={styles.ProfileDetails}>
            Phone number: {profile.phoneNumber}
          </Text>
          <Text style={styles.ProfileDetails}>Rating: {profile.Rating}</Text>
        </View>
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
    </Background>
  );
}
const styles = StyleSheet.create({
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
