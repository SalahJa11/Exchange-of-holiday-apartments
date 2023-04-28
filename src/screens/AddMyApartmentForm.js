import React, { useState, useEffect, useRef } from "react";
import Background from "../components/Background";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox, Modal } from "react-native-paper";
import { TextInput as ReactTextInput } from "react-native";
import BackButton from "../components/BackButton";
import { RadioButton } from "react-native-paper";
import { theme } from "../core/theme";
import TextInput from "../components/TextInput";
import { numberValidator } from "../helpers/numberValidator";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { addANewApartment } from "../config/cloud";
import { fixDate } from "../helpers/DateFunctions";
import Processing from "../components/Processing";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import { TOAST } from "../core/TOASTText";
import removeDuplicates from "../helpers/removeDuplicates";
import Error from "../components/Error";
import Warning from "../components/Warning";
import BackgroundForScroll from "../components/BackgroundForScroll";
export default function AddMyApartmentForm({ navigation }) {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("Error");
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Note");
  const [noteContent, setNoteContent] = useState("Done");
  const [warningVisible, setWarningVisible] = useState(false);
  const [warningTitle, setWarningTitle] = useState("Warning");
  const [warningContent, setWarningContent] = useState("Are you sure?");
  const [warningGoal, setWarningGoal] = useState("None");

  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
    typeof setWarningVisible2 === "function" ? setWarningVisible2(false) : null;
  };

  const [checked, setChecked] = useState("apartment");

  const [rooms, setRooms] = useState({ value: "", error: "" });
  const [bedrooms, setBedrooms] = useState({ value: "", error: "" });
  const [bathrooms, setBathrooms] = useState({ value: "", error: "" });
  const [kitchens, setKitchens] = useState({ value: "", error: "" });
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const [imagesAssets, setImagesAssets] = useState([]);
  const [displayImages, setDisplayImages] = useState(false);
  const [toDeleteImage, setToDeleteImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);
  // const [displayLocation, setDisplayLocation] = useState("none");
  const [region, setRegion] = useState({
    latitude: 31.7683,
    longitude: 35.2137,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [checked2, setChecked2] = useState(false);
  const [fromDate, setFromDate] = useState(new Date().getTime());
  const [toDate, setToDate] = useState(new Date().getTime());
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);

  const [alertTitle, setAlertTitle] = useState("Note");
  const [alertContent, setAlertContent] = useState(
    "Are you sure you want to remove image ?"
  );
  const [isAleretVisible, setIsAlertVisible] = useState(false);
  const [isNote, setIsNote] = useState(false);
  let noteColor = "#f76300";
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    if (showPicker) {
      setFromDate(new Date(currentDate).getTime());
      if (new Date(currentDate).getTime() > new Date(toDate).getTime()) {
        setToDate(new Date(currentDate).getTime());
      }
    } else if (showPicker2) {
      setToDate(new Date(currentDate).getTime());
    }
    setShowPicker(false);
    setShowPicker2(false);
  };

  const handleResult = async () => {
    const roomsError = numberValidator(rooms.value);
    const bedroomsError = numberValidator(bedrooms.value);
    const bathroomsError = numberValidator(bathrooms.value);
    const kitchensError = numberValidator(kitchens.value);
    if (roomsError || bedroomsError || bathroomsError || kitchensError) {
      setRooms({ ...rooms, error: roomsError });
      setBedrooms({ ...bedrooms, error: bedroomsError });
      setBathrooms({ ...bathrooms, error: bathroomsError });
      setKitchens({ ...kitchens, error: kitchensError });
      return;
    }
    let error = false;
    let errorMessage = "";
    if (!location) {
      error = true;
      errorMessage += "Location need to be set\n";
    }
    if (imagesAssets.length == 0) {
      error = true;
      errorMessage += "Need at least one image\n";
    }
    if (error === true) {
      setIsNote(false);
      setAlertTitle("Error");
      setAlertContent(errorMessage);
      setIsAlertVisible(true);
      return;
    } else {
      setIsProcessing(true);
      await addANewApartment(
        checked,
        rooms.value,
        bedrooms.value,
        bathrooms.value,
        kitchens.value,
        name,
        description,
        [location.latitude, location.longitude],
        imagesAssets,
        checked2,
        fromDate,
        toDate
      )
        .then(() => {
          setIsProcessing(false);
          navigation.goBack();
        })
        .catch((error) => {
          setIsProcessing(false);
          setIsNote(false);
          setAlertTitle("Error");
          setAlertContent(error.message);
          setIsAlertVisible(true);
        });
      setIsProcessing(false);
    }
  };
  const write = () => {
    return (
      <View style={styles.write2}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View style={{ flex: 1 }}>
            <TextInput
              label="Rooms"
              returnKeyType="next"
              value={rooms.value}
              onChangeText={(text) => setRooms({ value: text, error: "" })}
              error={!!rooms.error}
              errorText={rooms.error}
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Bedrooms"
              returnKeyType="next"
              value={bedrooms.value}
              onChangeText={(text) => setBedrooms({ value: text, error: "" })}
              error={!!bedrooms.error}
              errorText={bedrooms.error}
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View style={{ flex: 1 }}>
            <TextInput
              label="Bathrooms"
              returnKeyType="next"
              value={bathrooms.value}
              onChangeText={(text) => setBathrooms({ value: text, error: "" })}
              error={!!bathrooms.error}
              errorText={bathrooms.error}
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              label="kitchens"
              returnKeyType="next"
              value={kitchens.value}
              onChangeText={(text) => setKitchens({ value: text, error: "" })}
              error={!!kitchens.error}
              errorText={kitchens.error}
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={{ fontSize: 15, margin: 5 }}>Name</Text>
        <ReactTextInput
          multiline={true}
          style={{
            borderWidth: 1,
            borderRadius: 3,
            margin: 3,
            backgroundColor: theme.colors.surface,
            minHeight: 50,
            paddingLeft: 5,
          }}
          placeholder="(Optional)"
          value={name}
          onChangeText={(text) => setName(text)}
        ></ReactTextInput>
        <Text style={{ fontSize: 15, margin: 5 }}>Description</Text>
        <ReactTextInput
          multiline={true}
          style={{
            borderWidth: 1,
            borderRadius: 3,
            margin: 3,
            backgroundColor: theme.colors.surface,
            minHeight: 50,
            paddingLeft: 5,
          }}
          placeholder="(Optional)"
          value={description}
          onChangeText={(text) => setDescription(text)}
        ></ReactTextInput>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ textAlignVertical: "center" }}>Has a belcony?</Text>
          <Checkbox
            status={checked2 ? "checked" : "unchecked"}
            onPress={() => {
              setChecked2(!checked2);
            }}
          />
        </View>
      </View>
    );
  };
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status);
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      setAlertTitle("Error");
      setAlertContent(errorMsg);
      setIsNote(false);
      setIsAlertVisible(true);
      // setErrorMsg("");
      // return;
    } else {
      await Location.getCurrentPositionAsync({})
        .then((result) => {
          console.log("res", result.coords);
          setLocation(result.coords);
          mapRef.current.animateToRegion(
            {
              latitude: result.coords.latitude,
              longitude: result.coords.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.04,
            },
            2 * 1000
          );
        })
        .catch((error) => {
          setAlertContent(error.message);
          setAlertTitle("Error");
          setIsNote(false);
          setIsAlertVisible(true);
        });
    }

    // if (errorMsg) {
    //   let temp = errorMsg;
    //   setAlertContent(temp);
    //   setAlertTitle("Error");
    //   setIsNote(false);
    //   setIsAlertVisible(true);
    //   setErrorMsg("");
    // }
    // console.log(location);

    // return (
    //   <View style={styles.container}>
    //     <Text style={styles.paragraph}>{text}</Text>
    //   </View>
    // );
  };

  const pickImage = async () => {
    if (status.granted === false)
      await requestPermission().then(async (res) => {
        if (res.granted) {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [1, 1],
          });
          if (!result.canceled) {
            console.log(result);
            // setImage(result.assets[0].uri);
            setImagesAssets(
              removeDuplicates([...imagesAssets, ...result.assets])
            );
            setDisplayImages(true);
          }
        } else {
          setErrorTitle("Error");
          setErrorContent(
            "You've refused to allow this app to access your photos!"
          );
          setErrorVisible(true);
        }
      });
    else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [1, 1],
      });
      if (!result.canceled) {
        console.log(result);
        // setImage(result.assets[0].uri);
        setImagesAssets(removeDuplicates([...imagesAssets, ...result.assets]));
        setDisplayImages(true);
      }
    }
  };
  const removeSelectedImage = (item, toDelete = false) => {
    let temp = [...imagesAssets];
    var idx = temp.indexOf(item);
    console.log("var = >", idx);
    if (idx != -1) temp.splice(idx, 1);

    setWarningTitle("Warning");
    setWarningContent("Are you sure you want to remove image ?");
    setWarningGoal("removeSelectedImage");
    setWarningVisible(true);

    setToDeleteImage(item);
    if (toDelete) {
      setImagesAssets(temp);
      if (temp.length == 0) setDisplayImages(false);
    }
  };
  const ListItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          removeSelectedImage(item);
        }}
      >
        <Image
          source={{
            uri: item.uri,
          }}
          style={{ width: 150, height: 150, margin: 2 }}
          resizeMode="cover"
        />
        {/* <Text style={{}}>Hi</Text> */}
      </TouchableOpacity>
    );
  };
  const getImages = () => {
    pickImage();
  };
  const locationAndImages = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={getLocation}
          style={styles.locationAndImagesBoxes}
        >
          <Text
            style={{
              textAlignVertical: "center",
              marginRight: 10,
              color: "black",
            }}
          >
            Get my location
          </Text>
          <Image
            source={require("../assets/MapLoc.png")}
            style={{ height: 30, width: 30 }}
          ></Image>
        </TouchableOpacity>
        <View style={{ width: "100%", height: 190 }}>
          <MapView
            initialRegion={region}
            provider={PROVIDER_GOOGLE}
            onRegionChangeComplete={(region) => setRegion(region)}
            ref={mapRef}
            // scrollEnabled={false}
            // zoomEnabled={false}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {location && (
              <Marker
                style={styles.Marker}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={"title"}
                description={"description"}
              ></Marker>
            )}
          </MapView>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={getImages}
            style={styles.locationAndImagesBoxes}
          >
            <Text
              style={{
                textAlignVertical: "center",
                marginRight: 10,
                color: "black",
              }}
            >
              Insert images
            </Text>
            <Image
              source={require("../assets/insertImage.png")}
              style={{ height: 30, width: 30 }}
            ></Image>
          </TouchableOpacity>
          {displayImages && (
            <TouchableOpacity
              onPress={() => {
                console.log("pressed");
                showMessage(TOAST.AddMyApartmentForm);
              }}
              style={{
                alignItems: "center",
                flex: 0.1,
                // borderWidth: 2,
                // borderColor: theme.colors.primaryBorder,
                // borderRadius: 15,
                // borderBottomLeftRadius: 15,
                // backgroundColor: theme.colors.primaryBackground,
                justifyContent: "center",
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              <Image
                source={require("../assets/help2.png")}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: theme.colors.primary,
                }}
              ></Image>
            </TouchableOpacity>
          )}
        </View>
        {displayImages && (
          <View
            style={{
              width: "100%",
              height: 180,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: theme.colors.primary,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setWarningTitle("Warning");
                setWarningContent(
                  "Are tou sure you want to remove all images ?"
                );
                setWarningGoal("clearImages");
                setWarningVisible(true);
              }}
            >
              <Text
                style={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                Clear images
              </Text>
            </TouchableOpacity>
            <Text style={{ textAlignVertical: "center", textAlign: "center" }}>
              Press on image to remove it
            </Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              horizontal
              data={imagesAssets}
              renderItem={({ item }) => <ListItem item={item} />}
            ></FlatList>
          </View>
        )}
      </View>
    );
  };
  return (
    <BackgroundForScroll>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.ScrollView1}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          // zIndex: 3,
        }}
      >
        <View>
          <Text style={[styles.writeText, { fontSize: 20 }]}>Type</Text>
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                // width: "100%",
                // height: "50%",
                flexDirection: "row",
                //   display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Text style={[styles.writeText, { fontWeight: "bold" }]}>
                Apartment
              </Text>
              <RadioButton
                //   style={{}}
                value="apartment"
                status={checked === "apartment" ? "checked" : "unchecked"}
                onPress={() => setChecked("apartment")}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.writeText, { fontWeight: "bold" }]}>
                House
              </Text>
              <RadioButton
                value="house"
                status={checked === "house" ? "checked" : "unchecked"}
                onPress={() => setChecked("house")}
              />
            </View>
          </View>
        </View>
        <View>{locationAndImages()}</View>
        <View>
          <Text style={[styles.writeText, { fontSize: 20 }]}>
            Rooms Details
          </Text>

          {write()}
        </View>
        <View>
          <Text
            style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}
          >
            Available date
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                setShowPicker(true);
              }}
              style={{
                flex: 1,
                backgroundColor: theme.colors.primaryBackground,
                borderWidth: 1,
                borderColor: theme.colors.primaryBorder,
              }}
            >
              <Text
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                From
              </Text>
              <Text
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                {fixDate(fromDate)}
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 0.1 }}></View>
            <TouchableOpacity
              onPress={() => {
                console.log("count");
                setShowPicker2(true);
              }}
              style={{
                flex: 1,
                backgroundColor: theme.colors.primaryBackground,
                borderWidth: 1,
                borderColor: theme.colors.primaryBorder,
              }}
            >
              <View></View>
              <Text style={{ textAlign: "center" }}>To</Text>
              <Text
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                {fixDate(toDate)}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ textAlign: "center" }}></Text>

          <DateTimePickerModal
            isVisible={showPicker2 || showPicker}
            mode="date"
            minimumDate={
              showPicker2
                ? new Date(fromDate)
                : showPicker
                ? new Date()
                : new Date()
            }
            onConfirm={(date) => handleDateChange(null, date)}
            onCancel={() => {
              setShowPicker2(false);
              setShowPicker(false);
            }}
          />
        </View>
        <View style={styles.profilePressableButtonsView}>
          <TouchableOpacity
            style={styles.profilePressableButtons}
            onPress={navigation.goBack}
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
          <View style={{ flex: 0.1 }}></View>
          <TouchableOpacity
            style={[
              styles.profilePressableButtons,
              styles.profilePressableButtons2,
            ]}
            onPress={() => {
              handleResult();
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
      <Modal visible={isAleretVisible}>
        <View style={styles.alertContainer}>
          <View
            style={[
              styles.alertContentContainer,
              isNote ? { borderColor: noteColor } : { borderColor: "#ff3333" },
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
            {isNote && (
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <TouchableOpacity
                  style={styles.alertCloseButtonStyle}
                  onPress={() => {
                    setIsAlertVisible(false);
                  }}
                >
                  <Text style={styles.alertButtonTextStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.alertCloseButtonStyle}
                  onPress={() => {
                    setIsAlertVisible(false);
                    removeSelectedImage(toDeleteImage, true);
                    setIsAlertVisible(false);
                  }}
                >
                  <Text style={styles.alertButtonTextStyle}>Yes</Text>
                </TouchableOpacity>
              </View>
            )}
            {!isNote && (
              <TouchableOpacity
                style={[
                  styles.alertCloseButtonStyle,
                  isNote
                    ? { borderColor: noteColor }
                    : { borderColor: "#ff3333" },
                ]}
                onPress={() => {
                  setIsAlertVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.alertButtonTextStyle,
                    isNote ? { color: noteColor } : { color: "#ff3333" },
                  ]}
                >
                  close
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
      <Warning
        // style={{ zIndex: 1 }}
        visible={warningVisible}
        title={warningTitle}
        content={warningContent}
        CancelText={"Cancel"}
        onPressCancel={() => {
          toCloseError();
        }}
        onPressYes={() => {
          if (warningGoal === "clearImages") {
            setImagesAssets([]);
            setDisplayImages(false);
          }
          if (warningGoal === "removeSelectedImage") {
            removeSelectedImage(toDeleteImage, true);
          }
          toCloseError();
        }}
      ></Warning>
      <Error
        visible={errorVisible}
        title={errorTitle}
        content={errorContent}
        onPress={() => {
          toCloseError();
        }}
      />
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
      <FlashMessage position="bottom" floating={true} />
    </BackgroundForScroll>
  );
}
const styles = StyleSheet.create({
  write: {
    width: "100%",
    flexDirection: "row",
    height: 50,
    padding: 5,
  },
  writeText: {
    fontSize: 15,
    textAlignVertical: "center",
    flex: 1,
    color: "black",
  },
  writeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  profilePressableButtons: {
    // borderWidth: 2,
    // display: "flex",
    // margin: 5,
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
    height: 50,
    justifyContent: "space-between",
    // margin: 5,
    // position: "absolute",
    // bottom: 0,
    // backgroundColor: "#fd0000",
  },
  ScrollView1: {
    height: "100%",
    width: "100%",
    // zIndex: 2,
  },
  locationAndImagesBoxes: {
    flexDirection: "row",
    flex: 1,
    borderWidth: 2,
    borderColor: theme.colors.primaryBorder,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: theme.colors.primaryBackground,
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  alertContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    zIndex: 5,
  },

  alertContentContainer: {
    width: "70%",
    backgroundColor: "white",
    borderColor: "#f76300",
    borderWidth: 3,
    borderRadius: 7,
    padding: 10,
  },

  alertTitleTextStyle: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#f76300",
  },

  alertContentText: {
    textAlign: "left",
    fontSize: 16,
    marginBottom: 10,
    color: "#f76300",
    paddingRight: 8,
  },

  alertCloseButtonStyle: {
    width: "40%",
    height: 50,
    backgroundColor: "white",
    borderColor: "#f76300",
    borderWidth: 2,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },

  alertButtonTextStyle: {
    fontSize: 18,
    color: "#f76300",
  },
});
