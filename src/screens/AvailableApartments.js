import React, { useEffect, useState } from "react";
import Background from "../components/Background";
// import MapView from "react-native-maps";
import MapView, { Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { Marker } from "react-native-maps";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput as ReactTextInput,
  Platform,
} from "react-native";
import { Checkbox } from "react-native-paper";
import BackButton from "../components/BackButton";
import { getAllListedApartments } from "../config/cloud";
import Processing from "../components/Processing";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { numberValidatorAndEmpty } from "../helpers/numberValidatorAndEmpty";
import Error from "../components/Error";
export default function AvailableApartments({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rooms, setRooms] = useState({ value: "", value2: "", error: "" });
  const [bedrooms, setBedrooms] = useState({
    value: "",
    error: "",
  });
  const [bathrooms, setBathrooms] = useState({
    value: "",
    error: "",
  });
  const [kitchens, setKitchens] = useState({
    value: "",
    error: "",
  });
  const [roomsTo, setRoomsTo] = useState({ value: "", value2: "", error: "" });
  const [bedroomsTo, setBedroomsTo] = useState({
    value: "",
    error: "",
  });
  const [bathroomsTo, setBathroomsTo] = useState({
    value: "",
    error: "",
  });
  const [kitchensTo, setKitchensTo] = useState({
    value: "",
    error: "",
  });
  const [checked, setChecked] = useState(false);
  const [apartmentsTemp, setApartmentsTemp] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [apartments, setApartments] = useState([
    // {
    //   balcony: false,
    //   denominator: 0,
    //   numerator: 0,
    //   Listed: false,
    //   FromData: { nanoseconds: 0, seconds: 0 },
    //   ToDate: { nanoseconds: 0, seconds: 0 },
    //   Owner: "",
    //   Type: "",
    //   Rooms: "",
    //   BedRooms: "",
    //   Bathrooms: "",
    //   Kitchens: "",
    //   Name: "",
    //   Description: "",
    //   Location: [0, 0],
    //   Images: [""],
    //   Image:
    //     "https://firebasestorage.googleapis.com/v0/b/exchange-of-holiday-apar-45a07.appspot.com/o/image.png?alt=media&token=6eece138-9574-479e-a1c7-cf3316a88eda",
    // },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("error");
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };
  useEffect(() => {
    fetchData();
    setIsProcessing(false);
  }, []);

  async function fetchData() {
    setIsProcessing(true);
    try {
      const res = await getAllListedApartments();
      console.log("new res = ", res);
      setApartments([...res]);
      setApartmentsTemp([...res]);
      // console.log("new apartments = ", apartments);
      // console.log("apartmentId = ", apartments[0].apartmentId);
    } catch (error) {
      setErrorTitle("Error");
      setErrorContent(error.message);
      setIsProcessing(false);
      setErrorVisible(true);
    }
    setIsProcessing(false);
  }
  const apartmentMarker = () => {
    if (apartments.length > 0) {
      let finalResult = [];

      apartments.forEach((apartment, index) => {
        let name = "";
        if (apartment.Name !== "") name = apartment.Name.slice(0, 15);
        else name = "Not named";
        console.log("name = ", name);
        let temp = (
          <Marker
            key={index}
            style={styles.Marker}
            coordinate={{
              latitude: apartment.Location[0],
              longitude: apartment.Location[1],
            }}
            title={name}
            description={"Press for more info"}
            onCalloutPress={() => {
              navigation.navigate("ApartmentInfo", {
                paramKey: apartment,
              });
            }}
          >
            {Platform.OS === "ios" && (
              <Callout
                style={{ width: 100 }}
                onPress={() => {
                  navigation.navigate("ApartmentInfo", {
                    paramKey: apartment,
                  });
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    {name}
                  </Text>
                  <Text style={{ fontSize: 11 }}>Press for more info</Text>
                </View>
              </Callout>
            )}
            <Image
              source={{ uri: apartment.Image }}
              style={{ height: 35, width: 35 }}
            ></Image>
          </Marker>
        );
        finalResult.push(temp);
      });
      return finalResult;
    }
  };
  function clearValues() {
    setRooms({
      value: "",
      error: "",
    });
    setRoomsTo({
      value: "",
      error: "",
    });
    setKitchens({
      value: "",
      error: "",
    });
    setKitchensTo({
      value: "",
      error: "",
    });
    setBathrooms({
      value: "",
      error: "",
    });
    setBathroomsTo({
      value: "",
      error: "",
    });
    setBedrooms({
      value: "",
      error: "",
    });
    setBedroomsTo({
      value: "",
      error: "",
    });
  }
  function isBetween(str1, strbetween, str2) {
    let between = parseInt(strbetween);
    if (str1 === "" && str2 === "") return true;
    if (str1 === "" && str2 !== "") return between <= parseInt(str2);
    if (str1 !== "" && str2 === "") return between >= parseInt(str1);
    else return parseInt(str1) <= between && between <= parseInt(str2);
  }
  function filterArray(value) {
    if (!isBetween(rooms.value, value.Rooms, roomsTo.value)) return false;
    if (!isBetween(bathrooms.value, value.Bathrooms, bathroomsTo.value))
      return false;
    if (!isBetween(bedrooms.value, value.Bedrooms, bedroomsTo.value))
      return false;
    if (!isBetween(kitchens.value, value.Kitchens, kitchensTo.value))
      return false;
    if (value.Belcony != checked) return false;
    return true;
  }
  const handleFiltering = () => {
    const roomsError = numberValidatorAndEmpty(rooms.value);
    const roomsToError = numberValidatorAndEmpty(roomsTo.value);
    const bedroomsError = numberValidatorAndEmpty(bedrooms.value);
    const bedroomsToError = numberValidatorAndEmpty(bedroomsTo.value);
    const bathroomsError = numberValidatorAndEmpty(bathrooms.value);
    const bathroomsToError = numberValidatorAndEmpty(bathroomsTo.value);
    const kitchensError = numberValidatorAndEmpty(kitchens.value);
    const kitchensToError = numberValidatorAndEmpty(kitchensTo.value);
    if (
      roomsError ||
      bedroomsError ||
      bathroomsError ||
      kitchensToError ||
      roomsToError ||
      bedroomsToError ||
      bathroomsToError ||
      kitchensToError
    ) {
      setRooms({ ...rooms, error: roomsError });
      setBedrooms({ ...bedrooms, error: bedroomsError });
      setBathrooms({ ...bathrooms, error: bathroomsError });
      setKitchens({ ...kitchens, error: kitchensError });
      setRoomsTo({ ...roomsTo, error: roomsToError });
      setBedroomsTo({ ...bedroomsTo, error: bedroomsToError });
      setBathroomsTo({ ...bathroomsTo, error: bathroomsToError });
      setKitchensTo({ ...kitchensTo, error: kitchensToError });
      return;
    }
    const roomsToError2 = isBetween(rooms.value, roomsTo.value, "")
      ? ""
      : "Need greater value";
    const bedroomsToError2 = isBetween(bedrooms.value, bedroomsTo.value, "")
      ? ""
      : "Need greater value";
    const bathroomsToError2 = isBetween(bathrooms.value, bathroomsTo.value, "")
      ? ""
      : "Need greater value";
    const kitchensToError2 = isBetween(kitchens.value, kitchensTo.value, "")
      ? ""
      : "Need greater value";
    if (
      roomsToError2 ||
      bedroomsToError2 ||
      bathroomsToError2 ||
      kitchensToError2
    ) {
      setRoomsTo({ ...roomsTo, error: roomsToError2 });
      setBedroomsTo({ ...bedroomsTo, error: bedroomsToError2 });
      setBathroomsTo({ ...bathroomsTo, error: bathroomsToError2 });
      setKitchensTo({ ...kitchensTo, error: kitchensToError2 });
      return;
    }
    setApartments([...apartmentsTemp].filter(filterArray));
    setFiltered(true);
    setIsModalVisible(false);
    // setIndx
  };
  const write = () => {
    return (
      <View style={{ width: "100%" }}>
        <View>
          <Text style={styles.filterBoxTitle}>Rooms</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <TextInput
                label="From"
                returnKeyType="next"
                value={rooms.value}
                onChangeText={(text) => setRooms({ value: text, error: "" })}
                error={!!rooms.error}
                errorText={rooms.error}
                autoCapitalize="none"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 0.1 }}></View>
            <View style={{ flex: 1 }}>
              <TextInput
                label="To"
                returnKeyType="next"
                value={roomsTo.value}
                onChangeText={(text) => setRoomsTo({ value: text, error: "" })}
                error={!!roomsTo.error}
                errorText={roomsTo.error}
                autoCapitalize="none"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.filterBoxTitle}>Bedrooms</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <TextInput
                label="From"
                returnKeyType="next"
                value={bedrooms.value}
                onChangeText={(text) => setBedrooms({ value: text, error: "" })}
                error={!!bedrooms.error}
                errorText={bedrooms.error}
                autoCapitalize="none"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 0.1 }}></View>
            <View style={{ flex: 1 }}>
              <TextInput
                label="To"
                returnKeyType="next"
                value={bedroomsTo.value}
                onChangeText={(text) =>
                  setBedroomsTo({ value: text, error: "" })
                }
                error={!!bedroomsTo.error}
                errorText={bedroomsTo.error}
                autoCapitalize="none"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.filterBoxTitle}>Bathrooms</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <TextInput
                label="From"
                returnKeyType="next"
                value={bathrooms.value}
                onChangeText={(text) =>
                  setBathrooms({
                    value: text,
                    error: "",
                  })
                }
                error={!!bathrooms.error}
                errorText={bathrooms.error}
                autoCapitalize="none"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 0.1 }}></View>
            <View style={{ flex: 1 }}>
              <TextInput
                label="To"
                returnKeyType="next"
                value={bathroomsTo.value}
                onChangeText={(text) =>
                  setBathroomsTo({
                    value: text,
                    error: "",
                  })
                }
                error={!!bathroomsTo.error}
                errorText={bathroomsTo.error}
                autoCapitalize="none"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.filterBoxTitle}>kitchens</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <TextInput
                label="From"
                returnKeyType="next"
                value={kitchens.value}
                onChangeText={(text) => setKitchens({ value: text, error: "" })}
                error={!!kitchens.error}
                errorText={kitchens.error}
                autoCapitalize="none"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 0.1 }}></View>
            <View style={{ flex: 1 }}>
              <TextInput
                label="To"
                returnKeyType="next"
                value={kitchensTo.value2}
                onChangeText={(text) =>
                  setKitchensTo({ value: text, error: "" })
                }
                error={!!kitchensTo.error}
                errorText={kitchensTo.error}
                autoCapitalize="none"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.filterBoxTitle}>Belcony?</Text>
          <Checkbox
            style={{ alignSelf: "center" }}
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}
          />
        </View>
      </View>
    );
  };
  const filterWindow = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalView}>
          {write()}
          <View>
            {filtered && (
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  backgroundColor: "#fd0000",
                  width: "90%",
                  height: 40,
                  justifyContent: "center",
                }}
                onPress={() => {
                  setApartments(apartmentsTemp);
                  clearValues();
                  setFiltered(false);
                  setIsModalVisible(false);
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
                  Cancel Filter
                </Text>
              </TouchableOpacity>
            )}

            <View
              style={{
                flexDirection: "row",
                // flex: 1,
                // // position: "absolute",
                // bottom: 20,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.CloseModal,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => {
                  handleFiltering();
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
                  Apply filter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.CloseModal}
                onPress={() => setIsModalVisible(false)}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      {/*start your code here*/}
      {/* <Text>its AvailableApartments page start your code here</Text> */}
      <View
        style={{
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.locationAndImagesBoxes}
        >
          <Text
            style={{
              textAlignVertical: "center",
              marginRight: 10,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Filter
          </Text>
          <Image
            source={require("../assets/filter.png")}
            style={{ height: 30, width: 30 }}
          ></Image>
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            flex: 1,
          }}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: 31.769218,
              longitude: 35.164061,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            }}
          >
            {apartmentMarker()}
          </MapView>
        </View>
      </View>
      {filterWindow()}
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
  locationAndImagesBoxes: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 2,
    borderColor: theme.colors.primaryBorder,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: theme.colors.primaryBackground,
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  filterBoxTitle: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalView: {
    margin: 20,
    justifyContent: "space-between",
    // alignItems: "center",
    // height: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    elevation: 10,
  },
  CloseModal: {
    // display: "flex",
    margin: 5,
    flex: 1,
    borderRadius: 5,
    alignSelf: "center",
    backgroundColor: "#fd0000",
    width: "90%",
    height: 40,
    justifyContent: "center",
  },
  ScrollView1: {
    // marginTop: 20,
    height: "100%",
    width: "100%",
  },
  map: {
    // borderWidth: 4,
    // marginTop: 20,
    width: "100%",
    height: "100%",
  },
  marker: {
    width: 12,
    height: 10,
  },
});
