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
import { passwordRecoveryEmail, updateUserProfile } from "../config/cloud";
import * as ImagePicker from "expo-image-picker";
export default function ProfileUpdate({ navigation, route }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("Error");
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Note");
  const [noteContent, setNoteContent] = useState("Done");
  const [profile, setProfile] = useState(route.params?.paramKey);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageAssets(result.assets[0]);
    } else {
      setImageAssets({});
    }
  };

  const handleUpdate = async () => {
    const nameError = nameValidator(name.value);
    // const passwordError = passwordValidator(password.value);
    const phoneNumberError = phoneNumberValidator(phoneNumber.value);
    const idError = idValidator(id.value);

    if (nameError || phoneNumberError || idError) {
      setName({ ...name, error: nameError });
      setPhoneNumber({ ...phoneNumber, error: phoneNumberError });
      setId({ ...id, error: idError });
      return;
    }
    setIsProcessing(true);
    await updateUserProfile({
      name: name.value,
      personalID: id.value,
      phoneNumber: phoneNumber.value,
      imageAssets: imageAssets,
    })
      .then(() => {
        setIsProcessing(false);
        setNoteTitle("Note");
        setNoteContent("Account has been updated");
        setNoteVisible(true);
      })
      .catch((error) => {
        setIsProcessing(false);
        // console.log(error);
        setErrorTitle("Error");
        setErrorContent(error.message);
        setErrorVisible(true);
      });
    setIsProcessing(false);

    // uploadImageToDatabase(imageAssets);
  };
  const handlePasswordUpdate = async () => {
    setIsProcessing(true);
    await passwordRecoveryEmail(profile.email)
      .then(() => {
        setIsProcessing(false);
        setNoteTitle("Note");
        setNoteContent("Password reset email was sent");
        setNoteVisible(true);
      })
      .catch((error) => {
        setIsProcessing(false);
        setErrorTitle("Error");
        setErrorContent(error.message);
        setErrorVisible(true);
      });
  };
  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingBottom: 10,
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => pickImage()}>
              <Image
                style={styles.avatar}
                source={
                  image == ""
                    ? require("../assets/profile.png")
                    : { uri: image }
                }
              />
            </TouchableOpacity>

            <Text style={[styles.modalText, { color: "white", fontSize: 18 }]}>
              Click on image to update it
            </Text>
          </View>
        </View>
        <View style={styles.DetailsContainer}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {/* <Text style={styles.modalText}>Id: </Text> */}
            <TextInput
              defaultValue={profile.personalID}
              label="ID"
              returnKeyType="next"
              value={id.value}
              onChangeText={(text) => setId({ value: text, error: "" })}
              error={!!id.error}
              errorText={id.error}
              keyboardType="numeric"
            ></TextInput>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {/* <Text style={styles.modalText}>Name: </Text> */}
            <TextInput
              defaultValue={profile.name}
              label="Name"
              returnKeyType="next"
              value={name.value}
              onChangeText={(text) => setName({ value: text, error: "" })}
              error={!!name.error}
              errorText={name.error}
            ></TextInput>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {/* <Text style={styles.modalText}>Phone number: </Text> */}
            <TextInput
              defaultValue={profile.phoneNumber}
              label="Phone Number"
              returnKeyType="done"
              value={phoneNumber.value}
              onChangeText={(text) =>
                setPhoneNumber({ value: text, error: "" })
              }
              error={!!phoneNumber.error}
              errorText={phoneNumber.error}
              keyboardType="phone-pad"
            ></TextInput>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              margin: 5,
              flex: 1,
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
              height: 50,
              justifyContent: "center",
            }}
            onPress={() => {
              handlePasswordUpdate();
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              <Text style={styles.modalText}>
                Ask for password update by email
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profilePressableButtonsView}>
          <TouchableOpacity
            style={styles.profilePressableButtons}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profilePressableButtons,
              styles.profilePressableButtons2,
            ]}
            onPress={() => {
              handleUpdate();
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
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
    // backgroundColor: "#fd0000",
  },
});
