import React, { useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  Text,
  // TextInput,
  Modal,
  Image,
  Pressable,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import TextInput from "../components/TextInput";
import { nameValidator } from "../helpers/nameValidator";
import { phoneNumberValidator } from "../helpers/phoneNumberValidator";
import { idValidator } from "../helpers/idValidator";
// import OurActivityIndicator from "../components/OurActivityIndicator";
import * as paper from "react-native-paper";
import Button from "../components/Button";
import { theme } from "../core/theme";
import {
  signOutUser,
  getProfileIcon,
  uploadImageToDatabase,
  uploadProfileImageToDatabase,
  updateUserProfile,
  getUserData,
} from "../config/cloud";

export default function HomeScreen({ navigation, route }) {
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const [profile, setProfile] = useState(route.params?.paramKey);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("Processing...");
  const [modalVisible, setModalVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("Error");
  const [alertContent, setAlertContent] = useState("An error occurred");
  const [isAleretVisible, setIsAlertVisible] = useState(false);
  const [isNote, setIsNote] = useState(false);
  let noteColor = "green";
  const [userData, setUserData] = useState(true);
  const [editUserData, seteditUserData] = useState(false);

  const [name, setName] = useState({ value: profile.name, error: "" });
  // const [password, setPassword] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({
    value: profile.phoneNumber,
    error: "",
  });
  const [id, setId] = useState({ value: profile.personalID, error: "" });
  const [image, setImage] = useState(profile.image);
  const [imageAssets, setImageAssets] = useState({});
  const profileIcon = getProfileIcon();
  // console.log("paramkey inside homescreen ", profile);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  async function handleRefresh() {
    wait()
      .then(() => {
        getUserData()
          .then((profile) => {
            if (profile == "") {
              console.log("sign out function required !");
            } else {
              setProfile(profile);
              setId({ value: profile.personalID, error: "" });
              setName({ value: profile.name, error: "" });
              setPhoneNumber({
                value: profile.phoneNumber,
                error: "",
              });
              setImage(profile.image);
            }
          })
          .catch((error) => {
            setAlertTitle("Error");
            setAlertContent(error.message);
            setIsAlertVisible(true);
          });
      })
      .catch((error) => {
        setAlertTitle("Error");
        setAlertContent(error.message);
        setIsAlertVisible(true);
      });
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait().then(() => {
      handleRefresh().then(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
    }, []);
  });
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
    setProcessingText("Updating...");
    setIsProcessing(true);
    await updateUserProfile({
      name: name.value,
      personalID: id.value,
      phoneNumber: phoneNumber.value,
      imageAssets: imageAssets,
    })
      .then(() => {
        setIsProcessing(false);
        setIsNote(true);
        setAlertTitle("Note");
        setAlertContent("Account has been updated");
        setIsAlertVisible(true);
      })
      .catch((error) => {
        setIsProcessing(false);
        // console.log(error);
        setAlertTitle("Error");
        setAlertContent(error.message);
        setIsAlertVisible(true);
      });
    setModalVisible(false);
    seteditUserData(false);
    setUserData(true);
    // uploadImageToDatabase(imageAssets);
  };
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
  return (
    <Background>
      {/* hidden screen when you click in profile icon */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        style={{
          height: "100%",
          width: "100%",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <ScrollView
            style={styles.ScrollView1}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          >
            <View style={styles.HeddinScreeen}>
              {userData && (
                <Pressable
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.ProfileScreen}
                >
                  <View style={styles.header}>
                    <View style={styles.headerContent}>
                      <Image
                        style={styles.avatar}
                        source={
                          image == ""
                            ? require("../assets/profile.png")
                            : { uri: image }
                        }
                      />

                      <Text style={styles.name}>{profile.name}</Text>
                    </View>
                  </View>
                  <View style={styles.DetailsContainer}>
                    <Text style={styles.ProfileDetails}>
                      Id: {profile.personalID}
                    </Text>
                    <Text style={styles.ProfileDetails}>
                      Email: {profile.email}
                    </Text>
                    <Text style={styles.ProfileDetails}>
                      Phone number: {profile.phoneNumber}
                    </Text>
                    <Text style={styles.ProfileDetails}>
                      Rating:{" "}
                      {profile.denominator == 0
                        ? "0"
                        : profile.numerator / profile.denominator}
                    </Text>
                  </View>
                  <View style={styles.profilePressableButtonsView}>
                    <TouchableOpacity
                      style={styles.profilePressableButtons}
                      onPress={() => {
                        wait().then(() => {
                          setModalVisible(false);
                          setProcessingText("Signing out...");
                          setIsProcessing(true);

                          signOutUser()
                            .then(() => {
                              navigation.replace("StartScreen");
                            })
                            .catch((error) => alert(error.message));
                        });
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
                        Sign out
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.profilePressableButtons,
                        styles.profilePressableButtons2,
                      ]}
                      onPress={() => {
                        setUserData(false);
                        seteditUserData(true);
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
                        Update
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              )}
              {editUserData && (
                <View
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.ProfileScreen}
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

                      <Text
                        style={[
                          styles.modalText,
                          { color: "white", fontSize: 15 },
                        ]}
                      >
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
                        style={styles.modalTextInput}
                        defaultValue={profile.personalID}
                        label="ID"
                        returnKeyType="next"
                        value={id.value}
                        onChangeText={(text) =>
                          setId({ value: text, error: "" })
                        }
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
                        style={styles.modalTextInput}
                        defaultValue={profile.name}
                        label="Name"
                        returnKeyType="next"
                        value={name.value}
                        onChangeText={(text) =>
                          setName({ value: text, error: "" })
                        }
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
                        style={styles.modalTextInput}
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
                  <View style={styles.profilePressableButtonsView}>
                    <TouchableOpacity
                      style={styles.profilePressableButtons}
                      onPress={() => {
                        // wait().then(() => {
                        //   setModalVisible(false);
                        //   setIsProcessing(true);
                        //   signOutUser()
                        //     .then(() => {
                        //       navigation.replace("StartScreen");
                        //     })
                        //     .catch((error) => alert(error.message));
                        // });
                        seteditUserData(false);
                        setUserData(true);
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
                </View>
              )}
            </View>
          </ScrollView>
        </Modal>
        <TouchableOpacity
          style={styles.profileIconContainer}
          onPress={() => {
            setModalVisible(true);
            console.log("pressed");
          }}
        >
          <Image
            source={
              image == "" ? require("../assets/profile.png") : { uri: image }
            }
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          {/* <SafeAreaView style={styles.LogoTextContainer}>
          <Logo />
          </SafeAreaView> */}
          {/* all the button  */}
          <Logo />
          <Button
            mode="contained"
            onPress={() => navigation.navigate("AvailableApartments")}
          >
            Show Available Apartments
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("MyBookings")}
          >
            Show My Bookings
          </Button>
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate("AddMyApartment", {
                paramKey: profile,
              })
            }
          >
            Add My Apartment
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate("Chat")}>
            Open Chat
          </Button>
        </View>
        <paper.Modal visible={isProcessing}>
          <View style={styles.processingAlertContainer}>
            <View style={styles.processingAlertContentContainer}>
              <Text style={styles.processingAlertTextStyle}>
                {processingText}
              </Text>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          </View>
        </paper.Modal>
        <paper.Modal visible={isAleretVisible}>
          <View
            style={[
              styles.alertContainer,
              isNote ? { color: noteColor } : { color: "#ff3333" },
            ]}
          >
            <View
              style={[
                styles.alertContentContainer,
                isNote
                  ? { borderColor: noteColor }
                  : { borderColor: "#ff3333" },
              ]}
            >
              <Text
                style={[
                  styles.alertTitleTextStyle,
                  isNote ? { color: noteColor } : { color: "#ff3333" },
                ]}
              >
                {alertTitle}
              </Text>

              <Text
                style={[
                  styles.alertContentText,
                  isNote ? { color: noteColor } : { color: "#ff3333" },
                ]}
              >
                {alertContent}
              </Text>
              <TouchableOpacity
                style={[
                  styles.alertCloseButtonStyle,
                  isNote ? { borderColor: noteColor } : { color: "#ff3333" },
                ]}
                onPress={() => {
                  setIsAlertVisible(false);
                  wait(1)
                    .then(() => {
                      setIsNote(false);
                      handleRefresh();
                    })
                    .catch(() => {
                      setIsNote(false);
                      handleRefresh();
                    });
                }}
              >
                <Text
                  style={[
                    styles.alertButtonTextStyle,
                    isNote ? { color: noteColor } : "#ff3333",
                  ]}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </paper.Modal>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  profileIconContainer: {
    position: "absolute",
    top: 60,
    left: 8,
    width: 50,
    height: 50,
    zIndex: 1,
  },
  profileIcon: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  HeddinScreeen: {
    flex: 1,
    backgroundColor: "#000000aa",
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
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  DetailsContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  ProfileDetails: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    // borderRadius: 100,
    // borderWidth: 5,
    width: "100%",
    height: "100%",
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#1c6669",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 200,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  Text: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  LogoTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  ScrollView1: {
    height: "100%",
    width: "100%",
  },
  modalText: {
    fontSize: 20,
    alignSelf: "center",
    color: theme.colors.secondary,
    fontWeight: "bold",
  },
  modalTextInput: {
    // alignSelf: "center",
    // justifyContent: "center",
    fontWeight: "bold",
    // borderWidth: 2,
    // borderRadius: 5,
    backgroundColor: "white",
    // margin: 3,
    width: "100%",
    // maxWidth: "35%",
    // paddingLeft: 10,
    borderColor: theme.colors.primary,
    color: theme.colors.secondary,
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
  processingAlertContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  processingAlertContentContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 3,
    borderColor: "#1c6669",
  },

  processingAlertTextStyle: {
    fontSize: 20,
    marginRight: 15,
  },
  alertContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  alertContentContainer: {
    width: "70%",
    backgroundColor: "white",
    borderColor: "#ff3333",
    borderWidth: 3,
    borderRadius: 7,
    padding: 10,
  },

  alertTitleTextStyle: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#ff3333",
  },

  alertContentText: {
    textAlign: "left",
    fontSize: 16,
    marginBottom: 10,
    color: "#ff3333",
    paddingRight: 8,
  },

  alertCloseButtonStyle: {
    width: "70%",
    height: 50,
    backgroundColor: "white",
    borderColor: "#ff3333",
    borderWidth: 2,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },
  alertButtonTextStyle: {
    fontSize: 18,
    color: "#ff3333",
  },
});
