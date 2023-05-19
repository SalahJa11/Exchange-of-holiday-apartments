import React, { useEffect, useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import { theme } from "../core/theme";
import Paragraph from "../components/Paragraph";
import {
  Text,
  ActivityIndicator,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  getMyOldApartmentRating,
  getMyOldUserRating,
  getUserData,
  rateApartmentAndUser,
} from "../config/cloud";
import Processing from "../components/Processing";
import { Rating as CRating, AirbnbRating } from "react-native-ratings";
import Note from "../components/Note";
import Error from "../components/Error";
import BackgroundForScroll from "../components/BackgroundForScroll";
// import { Image } from "react-native-elements";
export default function Rating({ navigation, route }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("error");
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Note");
  const [noteContent, setNoteContent] = useState("Done");
  //   const wait = (timeout) => {
  //     return new Promise((resolve) => setTimeout(resolve, timeout));
  //   };
  function isObjEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };
  const [profile, setProfile] = useState(route.params?.paramKeyProfile);
  const [userComment, setUserComment] = useState("");
  const [apartmentComment, setApartmentComment] = useState("");
  const [apartment, setApartment2] = useState(route.params?.paramKeyAparment);
  const [oldUserRate, setOldUserRate] = useState(0);
  const [oldApartmentRate, setOldApartmentRate] = useState(0);
  const [newUserRate, setNewUserRate] = useState(3);
  const [newApartmentRate, setNewApartmentRate] = useState(3);
  async function fetchData() {
    if (!isObjEmpty(apartment)) {
      console.log("owner?", apartment.Owner);
      await getMyOldApartmentRating(apartment.apartmentId).then((res) => {
        setOldApartmentRate(res.rate);
        setApartmentComment(res.comment);
      });
    }
    await getMyOldUserRating(profile.userId).then((res) => {
      setOldUserRate(res.rate);
      setUserComment(res.comment);
      console.log("res.comment", res.comment);
    });
    // console.log("oldUserRating", oldUserRating);
    // console.log("oldApartmentRating", oldApartmentRating);
  }
  useEffect(() => {
    fetchData().catch((error) => {
      console.error(error.message);
    });
    // setIsProcessing(false);
  }, []);
  const handleRating = async () => {
    setIsProcessing(true);
    try {
      console.log(newUserRate, newApartmentRate);
      await rateApartmentAndUser(
        profile.userId,
        isObjEmpty(apartment) ? "" : apartment.apartmentId,
        newUserRate,
        newApartmentRate,
        userComment,
        apartmentComment
      ).then(() => {
        setIsProcessing(false);
        setNoteTitle("Note");
        setNoteContent("Thank you for rating");
        setNoteVisible(true);
      });
    } catch (error) {
      setIsProcessing(false);
      setErrorTitle("Error");
      setErrorContent(error.message);
      setErrorVisible(true);
    }
  };
  const ratingUser = (rating) => {
    console.log(typeof rating, rating);
    setNewUserRate(rating);
  };
  const ratingApartment = (rating) => {
    console.log(typeof rating, rating);
    setNewApartmentRate(rating);
  };
  ratingApartment;
  const apartmentRatingBox = () => {
    if (apartment !== "" && !isObjEmpty(apartment))
      return (
        <View
          style={{
            width: "100%",
            // borderWidth: 2,
            // borderColor: theme.colors.primaryBorder,
            padding: 10,
            // backgroundColor: theme.colors.primaryBackground,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "60%",
                //   aspectRatio: 1,
                // borderWidth: 2,
                //   borderRadius: 3,
              }}
            >
              <View
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  borderWidth: 2,
                  borderColor: theme.colors.primaryBorder,
                  borderRadius: 3,
                }}
              >
                <Image
                  style={{ width: "100%", aspectRatio: 1 }}
                  source={{ uri: apartment.Image }}
                />
              </View>
              <Text
                style={{
                  marginTop: 3,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {apartment.Name.slice(0, 20)}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <CRating
                minValue={1}
                tintColor={theme.colors.surface}
                style={{
                  borderWidth: 3,
                  borderRadius: 4,
                  backgroundColor: "#323232",
                  alignSelf: "center",
                  marginBottom: 50,
                }}
                ratingCount={5}
                imageSize={25}
                showRating
                onFinishRating={ratingApartment}
              />
              {oldApartmentRate <= 5 && oldApartmentRate >= 1 && (
                <Text
                  style={{
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Old rating was {oldApartmentRate}/5
                </Text>
              )}
            </View>
          </View>
          <TextInput
            multiline={true}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.primaryBorder,
              borderRadius: 3,
              margin: 3,
              backgroundColor: theme.colors.surface,
              minHeight: 50,
              paddingLeft: 5,
            }}
            placeholder="(Optional)"
            value={apartmentComment}
            onChangeText={(text) => setApartmentComment(text)}
          ></TextInput>
        </View>
      );
    else {
      return (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            // borderWidth: 2,
            // borderColor: theme.colors.primaryBorder,
            padding: 10,
            // backgroundColor: theme.colors.primaryBackground,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "60%",
              aspectRatio: 1,
              // borderWidth: 2,
              //   borderRadius: 3,
            }}
          >
            <View
              style={{
                width: "100%",
                aspectRatio: 1,
                borderWidth: 2,
                borderColor: theme.colors.primaryBorder,
                borderRadius: 3,
              }}
            >
              <Image
                style={{ height: "100%", aspectRatio: 1 }}
                source={require("../assets/deleteBig.png")}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                textAlignVertical: "center",
                fontWeight: "bold",
                color: "black",
              }}
            >
              Apartment not set{"\n"}or deleted
            </Text>
          </View>
        </View>
      );
    }
  };
  return (
    <BackgroundForScroll>
      {/* <View style={styles.View0}> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={{
          // flexGrow: 1,
          justifyContent: "center",
          backgroundColor: theme.colors.primaryBackground,
          borderWidth: 3,
          borderRadius: 3,
          borderColor: theme.colors.primary,
        }}
      >
        <View
          style={{
            width: "100%",
            // borderWidth: 2,
            // borderColor: theme.colors.primaryBorder,
            padding: 10,
            // backgroundColor: theme.colors.primaryBackground,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "60%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  borderWidth: 2,
                  borderColor: theme.colors.primaryBorder,
                  borderRadius: 3,
                }}
              >
                <Image
                  style={{ width: "100%", aspectRatio: 1 }}
                  source={{ uri: profile.image }}
                />
              </View>
              <Text
                style={{
                  marginTop: 3,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {profile.name.slice(0, 20)}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <CRating
                minValue={1}
                startingValue={3}
                tintColor={theme.colors.surface}
                style={{
                  borderWidth: 3,
                  borderRadius: 4,
                  backgroundColor: "#323232",
                  alignSelf: "center",
                  marginBottom: 50,
                }}
                ratingCount={5}
                imageSize={25}
                showRating
                onFinishRating={ratingUser}
              />
              {oldUserRate <= 5 && oldUserRate >= 1 && (
                <Text
                  style={{
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Old rating was {oldUserRate}/5
                </Text>
              )}
            </View>
          </View>
          <TextInput
            multiline={true}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.primaryBorder,
              borderRadius: 3,
              margin: 10,
              backgroundColor: theme.colors.surface,
              minHeight: 50,
              paddingLeft: 5,
            }}
            placeholder="(Optional)"
            value={userComment}
            onChangeText={(text) => setUserComment(text)}
          ></TextInput>
        </View>
        {apartmentRatingBox()}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.profilePressableButtons,
          styles.profilePressableButtons2,
        ]}
        onPress={() => {
          handleRating();
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
          Rate
        </Text>
      </TouchableOpacity>
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
          navigation.replace("HomeScreen");
        }}
        secondKey={false}
      ></Note>
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
    </BackgroundForScroll>
  );
}
const styles = StyleSheet.create({
  profilePressableButtons: {
    // borderWidth: 2,
    // display: "flex",
    margin: 5,
    height: 45,
    borderRadius: 5,
    backgroundColor: "#fd0000",
    width: "100%",
    justifyContent: "center",
  },
  profilePressableButtons2: {
    backgroundColor: theme.colors.primary,
  },
});
