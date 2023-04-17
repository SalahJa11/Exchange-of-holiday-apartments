import React, { useState, useEffect } from "react";
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
import * as paper from "react-native-paper";
import Button from "../components/Button";
import { theme } from "../core/theme";
import {
  signOutUser,
  getProfileIcon,
  getUserData,
  serverTime,
} from "../config/cloud";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation, route }) {
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const [profile, setProfile] = useState({
    apartments: [],
    denominator: 0,
    email: "example@example.example",
    image: "",
    isActive: false,
    name: "https://firebasestorage.googleapis.com/v0/b/exchange-of-holiday-apar-45a07.appspot.com/o/image.png?alt=media&token=6eece138-9574-479e-a1c7-cf3316a88eda",
    numerator: 0,
    personalID: "",
    phoneNumber: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("Processing...");
  const [modalVisible, setModalVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("Error");
  const [alertContent, setAlertContent] = useState("An error occurred");
  const [isAleretVisible, setIsAlertVisible] = useState(false);
  const [isNote, setIsNote] = useState(false);
  let noteColor = "green";
  const [image, setImage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    await getUserData()
      .then((profile) => {
        setProfile(profile);
        setImage(profile.image);
      })
      .catch((error) => {
        setAlertTitle("Error");
        setAlertContent(error.message);
        setIsAlertVisible(true);
      });
  };
  async function handleRefresh() {
    wait().then(async () => {
      await fetchData();
    });
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait().then(() => {
      handleRefresh().then(async () => {
        let x = await serverTime().catch((e) => {
          console.error(e.message);
        });
        console.log("new date = ", new Date().getDate(), Date());
        setIsLoading(false);
        setRefreshing(false);
      });
    }, []);
  });

  return (
    <Background>
      <SafeAreaView
        style={{
          height: "100%",
          width: "100%",
        }}
      >
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
                      Rating:{profile.Rating}
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
                        setModalVisible(false);
                        navigation.navigate("ProfileUpdate", {
                          paramKey: profile,
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
                        Update
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
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
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Chat")}
            >
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
      </SafeAreaView>
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
