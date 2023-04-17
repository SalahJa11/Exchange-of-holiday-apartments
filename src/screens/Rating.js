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
  const [apartment, setApartment2] = useState(route.params?.paramKeyAparment);
  const [oldUserRate, setOldUserRate] = useState(0);
  const [oldApartmentRate, setOldApartmentRate] = useState(0);
  const [newUserRate, setNewUserRate] = useState(3);
  const [newApartmentRate, setNewApartmentRate] = useState(3);
  async function fetchData() {
    if (!isObjEmpty(apartment)) {
      console.log("owner?", apartment.Owner);
      let oldApartmentRating = await getMyOldApartmentRating(
        apartment.apartmentId
      );
      setOldApartmentRate(oldApartmentRating);
    }
    let oldUserRating = await getMyOldUserRating(profile.userId);
    // console.log("oldUserRating", oldUserRating);
    // console.log("oldApartmentRating", oldApartmentRating);
    setOldUserRate(oldUserRating);
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
        newApartmentRate
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
            flexDirection: "row",
            width: "100%",
            borderWidth: 2,
            padding: 10,
            backgroundColor: "#323232",
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
                color: "white",
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
              tintColor="#323232"
              style={{
                backgroundColor: "#323232",
                alignSelf: "center",
                marginBottom: 50,
              }}
              //   type="star"
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
                  color: "white",
                }}
              >
                Old rating was {oldApartmentRate}/5
              </Text>
            )}
          </View>
        </View>
      );
    else {
      return (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            borderWidth: 2,
            padding: 10,
            backgroundColor: "#323232",
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
                textAlign: "center",
                textAlignVertical: "center",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Apartment got deleted
            </Text>
          </View>
        </View>
      );
    }
  };
  return (
    <Background innerStyle={{ justifyContent: "space-between" }}>
      {/* <View style={styles.View0}> */}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          borderWidth: 2,
          padding: 10,
          backgroundColor: "#323232",
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
              color: "white",
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
            //   type="custom"
            //   ratingColor="#3498db"
            //   ratingBackgroundColor="gray"
            //   ratingColor="gray"
            tintColor="#323232"
            // style={{
            //   backgroundColor: "#323232",
            //   alignSelf: "center",
            //   marginBottom: 50,
            // }}
            //   type="star"
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
                color: "white",
              }}
            >
              Old rating was {oldUserRate}/5
            </Text>
          )}
        </View>
      </View>
      {apartmentRatingBox()}
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
    </Background>
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
