import React, { useState, useEffect } from "react";
import Background from "../components/Background";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Modal,
} from "react-native";
// import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import FlashMessage, { showMessage } from "react-native-flash-message";

import {
  StartABooking,
  getApartmentOwner,
  getMyApartments,
  getMyEmail,
  getMyId,
  startAChat,
} from "../config/cloud";
import Error from "../components/Error";
import { Checkbox, RadioButton } from "react-native-paper";
import TextInput from "../components/TextInput";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { numberValidator } from "../helpers/numberValidator";
import Processing from "../components/Processing";
import Warning from "../components/Warning";
import Note from "../components/Note";
import { Avatar } from "react-native-elements";
import { fixDate, googleDateToJavaDate } from "../helpers/DateFunctions";
import { TOAST } from "../core/TOASTText";
import BackgroundForScroll from "../components/BackgroundForScroll";
import ReviewsBox from "../components/ReviewsBox";

export default function ApartmentInfo({ navigation, route }) {
  const [money, setMoney] = useState({ value: "", error: "" });
  const [selectedApartment, setSelectedApartment] = useState({
    id: "",
    image: "",
    fromDate: new Date().getTime(),
    toDate: new Date().getTime(),
  });
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);
  const [apartment, setApartment] = useState(route.params?.paramKey);
  console.log(
    "aparmkey apartment = route.params?.paramKey = ",
    route.params?.paramKey
  );
  const [checked, setChecked] = useState("apartment");

  const [myApartments, setMyApartments] = useState([
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
  const [owner, setOwner] = useState({
    // apartments: [],
    // denominator: 0,
    // email: "",
    // image: "",
    // isActive: false,
    // name: "https://firebasestorage.googleapis.com/v0/b/exchange-of-holiday-apar-45a07.appspot.com/o/image.png?alt=media&token=6eece138-9574-479e-a1c7-cf3316a88eda",
    // numerator: 0,
    // personalID: "",
    // phoneNumber: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("error");
  const [errorGoal, setErrorGoal] = useState("modal");
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Note");
  const [noteContent, setNoteContent] = useState("Done");
  const [warningVisible, setWarningVisible] = useState(false);
  const [warningTitle, setWarningTitle] = useState("Warning");
  const [warningContent, setWarningContent] = useState("Are you sure?");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sure, setSure] = useState(false);

  useEffect(() => {
    console.log("inside useEffect");
    fetchData();
    // setIsProcessing(false);
  }, []);
  const styleHeader = (owner) => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          {/* <Text style={{ textAlignVertical: "center" }}>
            {owner.name.slice(0, 15)}
          </Text> */}
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              navigation.push("OwnerDetails", {
                paramKey: owner,
              });
            }}
          >
            <Avatar
              size="medium"
              rounded
              source={{
                uri: owner.image,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      title: owner.name.slice(0, 15),
    });
  };

  async function fetchData() {
    // setIsProcessing(true);
    if (isObjEmpty(apartment)) return;
    try {
      console.log("ownerId = ", route.params?.paramKey.Owner);
      const res = await getApartmentOwner(route.params?.paramKey.Owner).then(
        (temp) => {
          setOwner({ ...temp, id: route.params?.paramKey.Owner });
          styleHeader({ ...temp, id: route.params?.paramKey.Owner });
        }
      );

      // styleHeader();
      console.log("owner = ", owner);
      const res2 = await getMyApartments();
      console.log("new res2 = ", res2);
      setMyApartments([...res2]);
    } catch (error) {
      console.error(error);
      // setIsProcessing(false);
    }
    // setIsProcessing(false);
  }

  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };

  const handleDateChange = (event, selectedDate) => {
    // console.log("hiThere", selectedDate);
    const currentDate = selectedDate;
    if (showPicker) {
      setSelectedApartment({
        ...selectedApartment,
        fromDate: new Date(currentDate).getTime(),
      });
      if (
        new Date(currentDate).getTime() >
        new Date(selectedApartment.toDate).getTime()
      ) {
        setSelectedApartment({
          ...selectedApartment,
          fromDate: new Date(currentDate).getTime(),
          toDate: new Date(currentDate).getTime(),
        });
      }
      // console.log("fromDate", fromDate);
    } else if (showPicker2) {
      setSelectedApartment({
        ...selectedApartment,
        toDate: new Date(currentDate).getTime(),
      });
      // console.log("toDate", toDate);
    }
    setShowPicker(false);
    setShowPicker2(false);
  };

  const ListItem = ({ item }) => {
    return (
      <View
        onLongPress={() => {
          console.log(item);
        }}
      >
        <Image
          source={
            item != ""
              ? {
                  uri: item,
                }
              : require("../assets/image.png")
          }
          style={{ height: "100%", margin: 2, aspectRatio: 1 }}
          resizeMode="cover"
        />
        {/* <Text style={{}}>Hi</Text> */}
      </View>
    );
  };
  const ListMyApatments = ({ item }) => {
    return (
      <TouchableOpacity
        onLongPress={() => {
          setSelectedApartment({
            ...selectedApartment,
            id: item.apartmentId,
            image: item.Image,
          });
          console.log(selectedApartment);
        }}
      >
        <Image
          source={
            item.Image != ""
              ? {
                  uri: item.Image,
                }
              : require("../assets/image.png")
          }
          style={{ width: 140, height: 140, margin: 2 }}
          resizeMode="cover"
        />
        {/* <Text style={{}}>Hi</Text> */}
      </TouchableOpacity>
    );
  };
  const handleANewConversation = async () => {
    try {
      await startAChat(route.params?.paramKey.Owner).then((newChatId) => {
        console.log(
          "sending :",
          {
            paramKey: newChatId,
            paramKeyEmail: owner.email,
            paramKeyImage: owner.image,
            paramKeyProfile: owner,
            paramKeyName: owner.name,
          },
          "profile",
          owner
        );
        navigation.navigate("Chating", {
          paramKey: newChatId,
          paramKeyEmail: owner.email,
          paramKeyImage: owner.image,
          paramKeyProfile: owner,
          paramKeyName: owner.name,
        });
      });
    } catch (error) {
      // console.error(JSON.stringify(error));
      // console.error(JSON.stringify(error.message));
      setErrorTitle("Error");
      setErrorContent(error.message);
      setErrorGoal("Error");
      setErrorVisible(true);
    }
  };
  const handleANewBooking = async (sure = false) => {
    console.log("hi");
    if (checked === "cash" || checked === "apartmentcash") {
      const moneyError = numberValidator(money.value);
      console.log("error0");
      if (moneyError) {
        setMoney({ ...money, error: moneyError });
        return;
      }
    }
    if (checked === "apartmentcash" || checked === "apartment")
      if (selectedApartment.id == "" || selectedApartment.image == "") {
        console.log("error");
        setModalVisible(false);
        setErrorTitle("Error");
        setErrorContent("Please select an apartment to exchange with");
        setErrorGoal("Modal");
        setErrorVisible(true);
        return;
      }

    console.log("hi3");
    if (sure) {
      setModalVisible(false);
      setIsProcessing(true);

      await StartABooking(
        apartment.Owner,
        apartment.apartmentId,
        apartment.Image,
        checked === "cash" || checked === "apartmentcash" ? true : false,
        selectedApartment.id,
        selectedApartment.image,
        money.value,
        selectedApartment.fromDate,
        selectedApartment.toDate,
        checked
      )
        .then(() => {
          setIsProcessing(false);
          setModalVisible(false);
          setNoteContent("Process done successfully");
          setNoteTitle("Note");
          setNoteVisible(true);
        })
        .catch((error) => {
          console.log("Error", error);
          setIsProcessing(false);
          setErrorTitle("Error");
          setErrorContent(error.message);
          setErrorGoal("Modal");
          setErrorVisible(true);
          return;
        });
    } else {
      console.log("hi2");
      setModalVisible(false);
      setWarningContent("Are you sure?");
      setWarningTitle("Warning");
      setWarningVisible(true);
      return;
    }
  };
  const ApartmentInfo = () => {
    if (!isObjEmpty(apartment))
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}
            >
              Available date
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View
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
                  {fixDate(googleDateToJavaDate(apartment.FromDate))}
                </Text>
              </View>
              <View style={{ flex: 0.1 }}></View>
              <View
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
                  {fixDate(googleDateToJavaDate(apartment.ToDate))}
                </Text>
              </View>
            </View>
            {/* <Text style={{ textAlign: "center" }}>
            {[
              googleDateToJavaDate(apartment.FromDate),
              " - ",
              googleDateToJavaDate(apartment.ToDate),
            ]}
          </Text> */}
          </View>

          <View>
            <Text
              style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}
            >
              Information
            </Text>
            <Text style={{ fontSize: 15 }}>Name: {apartment.Name}</Text>
            <Text style={styles.ProfileDetails}>Type: {apartment.Type}</Text>
            <Text style={styles.ProfileDetails}>Rooms: {apartment.Rooms}</Text>
            <Text style={styles.ProfileDetails}>
              BedRooms: {apartment.Bedrooms}
            </Text>
            <Text style={styles.ProfileDetails}>
              Bathrooms: {apartment.Bathrooms}
            </Text>
            <Text style={styles.ProfileDetails}>
              Kitchens: {apartment.Kitchens}
            </Text>
            <Text style={styles.ProfileDetails}>
              {apartment.Belcony ? "Belcony: exist" : "No belcony"}
            </Text>
            <Text style={styles.ProfileDetails}>
              Rating:{" "}
              {apartment.Rating === 0 ? "Not rated yet" : apartment.Rating}
            </Text>
          </View>
          {apartment.Description !== "" && (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Description
              </Text>
              <Text style={[styles.ProfileDetails]}>
                {apartment.Description}
              </Text>
            </View>
          )}
          <View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Location
              </Text>
              <View style={{ width: "100%", height: 150 }}>
                <MapView
                  scrollEnabled={false}
                  initialRegion={{
                    latitude: apartment.Location[0],
                    longitude: apartment.Location[1],
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04,
                  }}
                  provider={PROVIDER_GOOGLE}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Marker
                    style={styles.Marker}
                    coordinate={{
                      latitude: apartment.Location[0],
                      longitude: apartment.Location[1],
                    }}
                    // title={"title"}
                    // description={"description"}
                  ></Marker>
                </MapView>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  textAlignVertical: "center",
                }}
              >
                Images
              </Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("pressed");
                  showMessage(TOAST.AddMyApartmentForm);
                }}
                style={{
                  alignItems: "center",
                  flex: 0.1,
                  justifyContent: "center",
                  marginBottom: 1,
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
            </View>
            <FlatList
              style={{ width: "100%", aspectRatio: 1 }}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              horizontal
              data={apartment.Images}
              renderItem={({ item }) => <ListItem item={item} />}
            ></FlatList>
          </View>
          <ReviewsBox array={apartment.ratedBy} navigation={navigation} />
          {apartment.Owner != getMyId() && (
            <View style={{ width: "100%", height: 100 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.profilePressableButtons,
                  { backgroundColor: "green" },
                ]}
                onPress={() => {
                  setErrorGoal("Error");
                  handleANewConversation();
                }}
              >
                <Text style={styles.textStyle}>
                  Start conversation with the owner
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.profilePressableButtons,
                  { backgroundColor: "green" },
                ]}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Text style={styles.textStyle}>Suggest an exchange</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    else
      return (
        <View style={{ width: "100%", height: "100%" }}>
          <Text
            style={{
              textAlignVertical: "center",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Apartment got deleted
          </Text>
          <Image
            style={{ width: "100%", height: "100%" }}
            source={require("../assets/deleteBig.png")}
            resizeMode="contain"
          />
        </View>
      );
  };
  function isObjEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  const exchangeModal = () => {
    if (!isObjEmpty(apartment))
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                fontWeight: "bold",
                textAlignVertical: "center",
                textAlign: "center",
                fontSize: 17,
              }}
            >
              Form of Exchange
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlignVertical: "center",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                Apartment/House
              </Text>
              <RadioButton
                //   style={{}}
                value="apartment"
                status={checked === "apartment" ? "checked" : "unchecked"}
                onPress={() => setChecked("apartment")}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlignVertical: "center",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                Cash
              </Text>
              <RadioButton
                value="house"
                status={checked === "cash" ? "checked" : "unchecked"}
                onPress={() => setChecked("cash")}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlignVertical: "center",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                Apartment/House + Cash
              </Text>
              <RadioButton
                value="apartmentcash"
                status={checked === "apartmentcash" ? "checked" : "unchecked"}
                onPress={() => setChecked("apartmentcash")}
              />
            </View>
          </View>
          {(checked === "apartment" || checked === "apartmentcash") && (
            <>
              {myApartments.length != 0 && (
                <View
                  style={{
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlignVertical: "center",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    My Apartments/Houses
                  </Text>
                  <Text>{TOAST.SuggestAnExchange.message}</Text>
                  <Text>{TOAST.SuggestAnExchange.description}</Text>
                  <FlatList
                    nestedScrollEnabled
                    horizontal
                    data={myApartments}
                    renderItem={({ item }) => <ListMyApatments item={item} />}
                  ></FlatList>
                </View>
              )}
              {myApartments.length == 0 && (
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlignVertical: "center",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    You dont have any apartments
                  </Text>
                </View>
              )}
            </>
          )}
          <View
            style={{
              width: "100%",
              height: 152,
              borderRadius: 3,
              backgroundColor: theme.colors.surface,
              borderWidth: 2,
              borderColor: theme.colors.primaryBorder,
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 3,
              marginTop: 2,
              // borderWidth: 1,
            }}
          >
            <View
              style={{
                height: "100%",
                width: "40%",
                // borderWidth: 1,
                // borderColor: theme.colors.primaryBorder,
              }}
            >
              <Image
                style={{ height: "100%", width: "100%" }}
                source={
                  apartment.Image != ""
                    ? {
                        uri: apartment.Image,
                      }
                    : require("../assets/image.png")
                }
                resizeMode="contain"
              />
            </View>

            <Image
              style={{ height: 150, width: "10%" }}
              source={require("../assets/exchangeArrows.png")}
              resizeMode="contain"
            />

            <View style={{ height: "100%", width: "40%" }}>
              {checked === "cash" && (
                <View>
                  <TextInput
                    style={{ height: 30 }}
                    label="Cash"
                    value={money.value}
                    onChangeText={(text) =>
                      setMoney({ value: text, error: "" })
                    }
                    error={!!money.error}
                    errorText={money.error}
                    autoCapitalize="none"
                    keyboardType="numeric"
                  />
                  <Image
                    source={require("../assets/coins.png")}
                    style={{
                      height: 66,
                      width: "100%",
                    }}
                    resizeMode="contain"
                  />
                </View>
              )}
              {checked === "apartment" && (
                <Image
                  style={{ height: "100%", width: "100%" }}
                  source={
                    selectedApartment.image != ""
                      ? {
                          uri: selectedApartment.image,
                        }
                      : require("../assets/image.png")
                  }
                  resizeMode="contain"
                />
              )}
              {checked === "apartmentcash" && (
                <View
                  style={{
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <TextInput
                    style={{
                      height: 20,
                    }}
                    label="Cash"
                    value={money.value}
                    onChangeText={(text) =>
                      setMoney({ value: text, error: "" })
                    }
                    error={!!money.error}
                    errorText={money.error}
                    autoCapitalize="none"
                    keyboardType="numeric"
                  />

                  <Image
                    source={
                      selectedApartment.image != ""
                        ? {
                            uri: selectedApartment.image,
                          }
                        : require("../assets/image.png")
                    }
                    style={{
                      height: 78,
                      width: "100%",
                    }}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          </View>
          <View>
            <Text
              style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}
            >
              Dates
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
                  {fixDate(selectedApartment.fromDate)}
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
                  {fixDate(selectedApartment.toDate)}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ textAlign: "center" }}></Text>

            <DateTimePickerModal
              isVisible={showPicker2 || showPicker}
              mode="date"
              minimumDate={
                showPicker2
                  ? new Date(selectedApartment.fromDate)
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
              onPress={() => {
                setModalVisible(false);
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
                handleANewBooking();
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
      );
  };
  return (
    <Background>
      <ScrollView
        contentContainerStyle={{
          // flexGrow: 1,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
        style={styles.ScrollView1}
      >
        {ApartmentInfo()}
      </ScrollView>
      <Modal
        visible={modalVisible}
        // style={{ width: "100%" }}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <BackgroundForScroll>
          <View style={styles.modalView}>
            <ScrollView
              contentContainerStyle={{
                // borderWidth: 3,
                // backgroundColor: "white",
                flexGrow: 1,
                justifyContent: "space-evenly",
              }}
              showsVerticalScrollIndicator={false}
              style={styles.ScrollView1}
            >
              {exchangeModal()}
            </ScrollView>
          </View>
        </BackgroundForScroll>
        {/* </TouchableOpacity> */}
      </Modal>

      {/*start your code here*/}
      {/* <Text>its {JSON.stringify(apartment)} page start your code here</Text> */}
      <Error
        visible={errorVisible}
        title={errorTitle}
        content={errorContent}
        onPress={() => {
          toCloseError();
          if (errorGoal == "Modal") setModalVisible(true);
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
      <Warning
        // style={{ zIndex: 1 }}
        visible={warningVisible}
        title={warningTitle}
        content={warningContent}
        CancelText={"Cancel"}
        onPressCancel={() => {
          toCloseError();
          setSure(false);
          setModalVisible(true);
        }}
        onPressYes={() => {
          toCloseError();
          setWarningVisible(false);
          setSure(true);
          handleANewBooking(true);
        }}
      ></Warning>
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
      {/* <FlashMessage position="bottom" floating={true} /> */}
    </Background>
  );
}
const styles = StyleSheet.create({
  profileIconContainer: {
    position: "absolute",
    top: 60,
    right: 8,
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
  textStyle: {
    textAlignVertical: "center",
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  // profilePressableButtons: {
  //   display: "flex",
  //   margin: 5,
  //   flex: 1,
  //   borderRadius: 5,
  //   backgroundColor: "#fd0000",
  //   height: 30,
  //   justifyContent: "center",
  // },
  ScrollView1: {
    height: "100%",
    width: "100%",
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
  profilePressableButtons: {
    // borderWidth: 2,
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
    justifyContent: "flex-end",
    marginBottom: 5,
    // position: "absolute",
    // bottom: 0,
    // backgroundColor: "#fd0000",
  },
});
