import React, { useState, useEffect } from "react";
import Background from "../components/Background";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import Processing from "../components/Processing";
import {
  confirmABooking,
  getApartmentById,
  getApartmentOwner,
  getMyBookings,
  getMyId,
  getValidApartmentById,
  removeABooking,
} from "../config/cloud";
import { theme } from "../core/theme";
import Note from "../components/Note";
import Warning from "../components/Warning";
import Error from "../components/Error";
import { Checkbox } from "react-native-paper";
import FlashMessage, { showMessage } from "react-native-flash-message";

import { fixDate, googleDateToJavaDate } from "../helpers/DateFunctions";
import { TOAST } from "../core/TOASTText";
export default function MyBookings({ navigation }) {
  const [search, setSearch] = useState("");

  const [showCancelled, setShowCancelled] = useState(true);
  const [showExpired, setShowExpired] = useState(true);
  const [showConfirmed, setShowConfirmed] = useState(true);
  const [showDoneConfirmed, setShowDoneConfirmed] = useState(true);
  const [showResponse, setShowResponse] = useState(true);
  const [showMyResponse, setShowMyResponse] = useState(true);
  const [showMySuggestments, setShowMySuggestments] = useState(true);
  const [showSuggestments, setShowSuggestments] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
  const [warningGoal, setWarningGoal] = useState("");
  const [iAm, setIAm] = useState(0);
  const [byMoney, setByMoney] = useState(false);
  const [profile2, setProfile2] = useState({
    apartments: [],
    denominator: 0,
    email: "",
    image: "",
    isActive: false,
    name: "https://firebasestorage.googleapis.com/v0/b/exchange-of-holiday-apar-45a07.appspot.com/o/image.png?alt=media&token=6eece138-9574-479e-a1c7-cf3316a88eda",
    numerator: 0,
    personalID: "",
    phoneNumber: "",
  });
  const [apartment2, setApartment2] = useState({
    balcony: false,
    denominator: 0,
    numerator: 0,
    Listed: false,
    FromData: { nanoseconds: 0, seconds: 0 },
    ToDate: { nanoseconds: 0, seconds: 0 },
    Owner: "",
    Type: "",
    Rooms: "",
    BedRooms: "",
    Bathrooms: "",
    Kitchens: "",
    Name: "https://firebasestorage.googleapis.com/v0/b/exchange-of-holiday-apar-45a07.appspot.com/o/image.png?alt=media&token=6eece138-9574-479e-a1c7-cf3316a88eda",
    Description: "",
    Location: [0, 0],
    Images: [""],
    Image: "",
  });
  const [apartment1, setApartment1] = useState({
    balcony: false,
    denominator: 0,
    numerator: 0,
    Listed: false,
    FromData: { nanoseconds: 0, seconds: 0 },
    ToDate: { nanoseconds: 0, seconds: 0 },
    Owner: "",
    Type: "",
    Rooms: "",
    BedRooms: "",
    Bathrooms: "",
    Kitchens: "",
    Name: "",
    Description: "",
    Location: [0, 0],
    Images: [""],
    Image: "",
  });
  const [index, setIndex] = useState(0);
  let myId = getMyId();
  const [bookings, setBookings] = useState([
    // {
    //   _id2: "",
    //   _id2Apartment: "",
    //   _id2ApartmentImage: "",
    //   _id1: "",
    //   _id1Apartment: "",
    //   _id1ApartmentImage: "",
    //   FromDate: new Date(),
    //   ToDate: new Date(),
    //   Money: "",
    //   byMoney: false,
    //   confirmed: false,
    //   cancelled: false,
    //   toDelete: false,
    // },
  ]);
  const [bookingsTemp, setBookingsTemp] = useState([
    {
      _id2: "",
      _id2Apartment: "",
      _id2ApartmentImage: "",
      _id1: "",
      _id1Apartment: "",
      _id1ApartmentImage: "",
      FromDate: new Date(),
      ToDate: new Date(),
      Money: "",
      byMoney: false,
      confirmed: false,
      cancelled: false,
      toDelete: false,
    },
  ]);
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };
  useEffect(() => {
    fetchData();
    // setIsProcessing(false);
  }, []);
  async function fetchData() {
    setIndex(0);
    setIsProcessing(true);
    try {
      const res = await getMyBookings();
      // res = saveStatus([...res]);
      // res = splitStatus(res);
      console.log("new res = ", res);
      let temp = [...res];

      temp = splitStatus(temp);
      temp = saveStatus(temp);
      console.log("setting booking =>", temp);
      // temp = applyFilter(temp);
      temp.sort(function (x, y) {
        return x.createdAt - y.createdAt;
      });
      temp = temp.reverse();
      setBookings([...temp]);
      setBookingsTemp([...temp]);
    } catch (error) {
      setIsProcessing(false);
    }
    setIsProcessing(false);
  }
  async function fetchBookingData(index) {
    console.log("my index = ", index);
    setIsProcessing(true);
    if (bookings[index]._id1 == "") return;
    let tempId = bookings[index]._id1;
    if (myId == tempId) {
      setIAm(1);
      tempId = bookings[index]._id2;
    } else {
      setIAm(2);
      tempId = bookings[index]._id1;
    }

    try {
      const res = await getApartmentOwner(tempId);
      console.log("getApartmentOwner = ", res);
      setProfile2({ ...res });
      const res2 = await getValidApartmentById(bookings[index]._id2Apartment);
      console.log("getValidApartmentById = ", res2);
      setApartment2({ ...res2 });
      if (!bookings[index].byMoney) {
        const res3 = await getValidApartmentById(bookings[index]._id1Apartment);
        console.log("getValidApartmentById = ", res3);
        setApartment1({ ...res3 });
      } else console.log("money = ", bookings[index].Money);
    } catch (error) {
      console.error(error.message);
      setIsProcessing(false);
    }
    setIsProcessing(false);
  }
  const handleCancelAndRemove = async () => {
    setModalVisible(false);
    setIsProcessing(true);
    try {
      console.log("latest before removeABooking");

      await removeABooking(bookings[index].bookingId, bookings[index].toDelete);
      console.log("latest after removeABooking");
    } catch (error) {
      console.error(error.message);
      setIsProcessing(false);
      // fetchData();
    }
    setIsProcessing(false);
    console.log("latest beforeFetchData");
    fetchData();
  };
  const handleConfirm = async () => {
    setModalVisible(false);
    setIsProcessing(true);
    try {
      console.log(
        "falseDates 0",
        new Date(bookings[index].FromData).toLocaleDateString("en-US"),
        new Date(bookings[index].ToDate).toLocaleDateString("en-US"),
        bookings[index].FromData,
        bookings[index].ToDate
      );
      console.log(
        "falseDates 1 ",
        googleDateToJavaDate(bookings[index].FromDate),
        googleDateToJavaDate(bookings[index].ToDate)
      );
      await confirmABooking(
        bookings[index].bookingId,
        bookings[index]._id1Apartment,
        bookings[index]._id2Apartment,
        googleDateToJavaDate(bookings[index].FromDate),
        googleDateToJavaDate(bookings[index].ToDate)
      );
    } catch (error) {
      setIsProcessing(false);
      setErrorTitle("Error");
      setErrorContent(error.message);
      setErrorGoal("Error");
      setErrorVisible(true);
      // fetchData();
    }
    setIsProcessing(false);
    fetchData();
  };
  const filterWindow = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={filterVisible}>
        <View style={styles.modalView}>
          <View style={{ width: "100%" }}>
            <View style={{ justifyContent: "space-around" }}>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.filterBoxTitle}>
                    Show expired bookings
                  </Text>
                  <Checkbox
                    status={showExpired ? "checked" : "unchecked"}
                    onPress={() => {
                      setShowExpired(!showExpired);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.filterBoxTitle}>
                    Show Cancelled bookings
                  </Text>
                  <Checkbox
                    status={showCancelled ? "checked" : "unchecked"}
                    onPress={() => {
                      setShowCancelled(!showCancelled);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.filterBoxTitle}>
                    Show confirmed bookings
                  </Text>
                  <Checkbox
                    status={showConfirmed ? "checked" : "unchecked"}
                    onPress={() => {
                      setShowConfirmed(!showConfirmed);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.filterBoxTitle}>
                    Show confirmed and done bookings
                  </Text>
                  <Checkbox
                    status={showDoneConfirmed ? "checked" : "unchecked"}
                    onPress={() => {
                      setShowDoneConfirmed(!showDoneConfirmed);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.filterBoxTitle}>
                    Show booking waiting my response
                  </Text>
                  <Checkbox
                    status={showMyResponse ? "checked" : "unchecked"}
                    onPress={() => {
                      setShowMyResponse(!showMyResponse);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.filterBoxTitle}>
                    Show booking waiting owner response
                  </Text>
                  <Checkbox
                    status={showResponse ? "checked" : "unchecked"}
                    onPress={() => {
                      setShowResponse(!showResponse);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.filterBoxTitle}>
                    Show my suggestments bookings
                  </Text>
                  <Checkbox
                    status={showMySuggestments ? "checked" : "unchecked"}
                    onPress={() => {
                      setShowMySuggestments(!showMySuggestments);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.filterBoxTitle}>
                    Show people suggestment bookings
                  </Text>
                  <Checkbox
                    status={showSuggestments ? "checked" : "unchecked"}
                    onPress={() => {
                      setShowSuggestments(!showSuggestments);
                    }}
                  />
                </View>
              </View>
              <View style={{ width: "100%", height: 50, flexDirection: "row" }}>
                <TouchableOpacity
                  style={[
                    styles.profilePressableButtons,
                    styles.profilePressableButtons2,
                  ]}
                  onPress={() => {
                    setBookings(applyFilter([...bookingsTemp]));
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
                    Update result
                  </Text>
                </TouchableOpacity>
                <View style={{ flex: 0.1 }} />
                <TouchableOpacity
                  style={styles.profilePressableButtons}
                  onPress={() => setFilterVisible(false)}
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
          <View>
            <View
              style={{
                flexDirection: "row",
                // flex: 1,
                // // position: "absolute",
                // bottom: 20,
              }}
            >
              <TouchableOpacity
                style={styles.CloseModal}
                onPress={() => setFilterVisible(false)}
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
  const applyFilter = (bookingsArray) => {
    let res = bookingsArray.map((element) => {
      let newElement = { ...element };
      if (showCancelled && newElement.status == "Cancelled") return newElement;
      if (showExpired && newElement.status == "Expired") return newElement;
      if (showConfirmed && newElement.status == "Confirmed") return newElement;
      if (showDoneConfirmed && newElement.status == "Confirmed and done")
        return newElement;
      if (showMyResponse && newElement.status == "Waiting for my response")
        return newElement;
      if (showResponse && newElement.status == "Waiting for owner response")
        return newElement;
      // if (showMySuggestments && newElement.mine) return newElement;
      // if (showSuggestments && !newElement.mine) return newElement;
    });
    res = res.filter((item) => item !== undefined);
    let temp1 = [];
    let temp2 = [];
    if (showMySuggestments) {
      temp1 = res.filter((item) => {
        return item.mine;
      });
    }
    if (showSuggestments) {
      temp2 = res.filter((item) => {
        return !item.mine;
      });
    }
    // console.log("returning ", [...temp1, temp2], temp1, temp2);
    let finalRes = [...temp1, ...temp2];
    finalRes.sort(function (x, y) {
      return x.createdAt - y.createdAt;
    });
    finalRes = finalRes.reverse();
    return finalRes;
  };
  const splitStatus = (bookingsArray) => {
    const res = bookingsArray.map((element) => {
      let newElement = { ...element };
      if (newElement._id1 == myId) {
        newElement.mine = true;
      } else newElement.mine = false;
      return newElement;
    });

    console.log("split", res);
    return res;
  };
  const saveStatus = (bookingsArray) => {
    console.log("bookingArrayLength = ", bookingsArray.length, bookingsArray);
    const dateTemp = new Date().setHours(0, 0, 0, 0);
    const res = bookingsArray.map((element) => {
      let newElement = { ...element };
      if (element.confirmed) {
        if (
          new Date(googleDateToJavaDate(element.ToDate)).setHours(0, 0, 0, 0) >=
          dateTemp
        ) {
          newElement.status = "Confirmed";
          console.log("confirmed");
        } else {
          newElement.status = "Confirmed and done";
          console.log("Confirmed and done");
        }
      } else if (element.cancelled) {
        newElement.status = "Cancelled";
        console.log("cancelled");
      } else if (
        new Date(googleDateToJavaDate(element.FromDate)).setHours(0, 0, 0, 0) <
        dateTemp
      ) {
        newElement.status = "Expired";
        console.log("Expired");
      } else if (
        new Date(googleDateToJavaDate(element.FromDate)).setHours(0, 0, 0, 0) >=
        dateTemp
      ) {
        if (newElement.mine) {
          newElement.status = "Waiting for owner response";
          console.log("Waiting for owner response");
        } else {
          newElement.status = "Waiting for my response";
          console.log("Waiting for my response");
        }
      } else {
        newElement.status = "None";
        console.log("none");
      }
      console.log("i");
      return newElement;
    });
    // console.log(res);
    return res;
  };

  function oneBookingSide(id = 1) {
    // let mine = <View></View>;
    if (id == 1) {
      console.log("bookings[index].byMoney", index, bookings[index].byMoney);
      if (bookings[index].byMoney) {
        return (
          <View
            style={{
              margin: 5,
              width: "100%",
              height: 100,
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                textAlignVertical: "center",
                // backgroundColor: "black",
                // opacity: 0.75,
                fontSize: 15,
                color: "black",
                fontWeight: "bold",
              }}
            >
              {myId == bookings[index]._id1
                ? "My offer : (" + bookings[index].Money + ")  Shekels"
                : "Offered cash : (" + bookings[index].Money + ")  Shekels"}
            </Text>
            <Image
              style={{ height: "100%", aspectRatio: 1 }}
              source={require("../assets/coins.png")}
              resizeMode="contain"
            />
          </View>
        );
      } else {
        return (
          <View
            style={{ width: "100%", width: "100%", aspectRatio: 1 }}
            onLongPress={() => {
              setModalVisible(false);
              navigation.navigate("ApartmentInfo", {
                paramKey: apartment1,
              });
            }}
          >
            <View
              style={{
                width: "100%",
                aspectRatio: 1,
              }}
            >
              <Image
                style={{ height: "100%", width: "100%", aspectRatio: 1 }}
                source={
                  bookings[index]._id1ApartmentImage != ""
                    ? {
                        uri: bookings[index]._id1ApartmentImage,
                      }
                    : require("../assets/image.png")
                }
                resizeMode="contain"
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: 35,
                  backgroundColor: "black",
                  opacity: 0.75,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  {myId == bookings[index]._id1
                    ? "My apartment"
                    : "Other apartment"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("ApartmentInfo", {
                    paramKey: apartment1,
                  });
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 35,
                  height: 35,
                }}
              >
                <Image
                  style={{ height: 35, aspectRatio: 1 }}
                  source={require("../assets/link.png")}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    } else
      return (
        <View style={{ width: "100%", width: "100%", aspectRatio: 1 }}>
          <View
            style={{
              width: "100%",
              aspectRatio: 1,
            }}
          >
            <Image
              style={{ height: "100%", width: "100%", aspectRatio: 1 }}
              source={
                bookings[index]._id2ApartmentImage != ""
                  ? {
                      uri: bookings[index]._id2ApartmentImage,
                    }
                  : require("../assets/image.png")
              }
              resizeMode="contain"
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: 35,
                backgroundColor: "black",
                opacity: 0.75,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  alignSelf: "center",
                }}
              >
                {myId == bookings[index]._id2
                  ? "My apartment"
                  : "Other apartment"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("ApartmentInfo", {
                  paramKey: apartment2,
                });
              }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 35,
                height: 35,
              }}
            >
              <Image
                style={{ height: 35, aspectRatio: 1 }}
                source={require("../assets/link.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    // return mine;
  }
  const bookingDetails = () => {
    let temp = new Date().setHours(0, 0, 0, 0);
    let toLetConfirm =
      new Date(googleDateToJavaDate(bookings[index].FromDate)).setHours(
        0,
        0,
        0,
        0
      ) >= temp &&
      new Date(googleDateToJavaDate(bookings[index].ToDate)).setHours(
        0,
        0,
        0,
        0
      ) >= temp &&
      myId == bookings[index]._id2 &&
      !bookings[index].confirmed &&
      !bookings[index].cancelled;
    return (
      <View style={{ width: "100%" }}>
        <View style={{ marginVertical: 2 }}>{oneBookingSide(1)}</View>
        <View style={{ marginVertical: 2 }}>{oneBookingSide(2)}</View>
        <View>
          <Text
            style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}
          >
            Suggested date
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
                {fixDate(googleDateToJavaDate(bookings[index].FromDate))}
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
                {fixDate(googleDateToJavaDate(bookings[index].ToDate))}
              </Text>
            </View>
          </View>
        </View>
        {toLetConfirm && myId == bookings[index]._id2 && (
          <TouchableOpacity
            style={{
              display: "flex",
              marginTop: 5,
              marginHorizontal: 5,
              flex: 1,
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
              height: 40,
              justifyContent: "center",
            }}
            onPress={() => {
              setModalVisible(false);
              setWarningContent("Are you sure ?");
              setWarningTitle("Warning");
              setWarningGoal("confirm");
              setWarningVisible(true);
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
              Confirm exchange
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
    // return [oneBookingSide((id = 1)), oneBookingSide((id = 2))];
  };

  const handleBookingModal = () => {
    // let a = new Date(googleDateToJavaDate(bookings[index].FromDate)).setHours(0, 0, 0, 0);
    // let b = new Date(googleDateToJavaDate(bookings[index].ToDate)).setHours(0, 0, 0, 0);
    // let c = new Date().getTime();
    // console.log(a, b, c, a > c, b > c, new Date(googleDateToJavaDate(bookings[index].ToDate)));
    return (
      <View
        style={{ width: "100%", height: "100%" }}
        // onPress={() => setModalVisible(false)}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerContent}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("OwnerDetails", {
                paramKey: profile2,
              });
            }}
          >
            <Image
              style={styles.avatar}
              source={
                profile2.image == ""
                  ? require("../assets/profile.png")
                  : { uri: profile2.image }
              }
            />

            <Text style={{ color: "black", fontSize: 24 }}>
              {profile2.name}
            </Text>
          </TouchableOpacity>
        </View>
        {bookingDetails()}
        <View style={styles.profilePressableButtonsView}>
          {!bookings[index].confirmed && (
            <>
              <TouchableOpacity
                style={styles.profilePressableButtons}
                onPress={() => {
                  setModalVisible(false);
                  setWarningContent("Are you sure ?");
                  setWarningTitle("Warning");
                  setWarningGoal("cancelAndRemove");
                  setWarningVisible(true);
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
                  Cancel & remove
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 0.1 }}></View>
            </>
          )}
          <TouchableOpacity
            style={[
              styles.profilePressableButtons,
              styles.profilePressableButtons2,
            ]}
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
              Close
            </Text>
          </TouchableOpacity>
          {bookings[index].status == "Confirmed and done" && (
            <>
              <View style={{ flex: 0.1 }}></View>
              <TouchableOpacity
                style={[
                  styles.profilePressableButtons,
                  styles.profilePressableButtons2,
                ]}
                onPress={() => {
                  setModalVisible(false);

                  navigation.navigate("Rating", {
                    paramKeyProfile: profile2,
                    paramKeyAparment:
                      myId == bookings[index]._id1
                        ? apartment2
                        : bookings[index].byMoney
                        ? ""
                        : apartment1,
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
                  Rate
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };
  // const searchFilterFunction = (text) => {
  //   // Check if searched text is not blank
  //   if (text) {
  //     // Inserted text is not blank
  //     // Filter the masterDataSource and update FilteredDataSource
  //     const newData = bookingsTemp.filter(function (item) {
  //       // Applying filter for the inserted text in search bar
  //       const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
  //       const textData = text.toUpperCase();
  //       return itemData.indexOf(textData) > -1;
  //     });
  //     setChats(newData);
  //     setSearch(text);
  //   } else {
  //     // Inserted text is blank
  //     // Update FilteredDataSource with masterDataSource
  //     setChats(tempChats);
  //     setSearch(text);
  //   }
  // };
  const everyBookingCard = () => {
    let res = [];
    bookings.forEach((element, index) => {
      let imageScr = require("../assets/image.png");
      let color = theme.colors.primary;
      let color2 = color;
      if (
        element.status == "Waiting for my response" ||
        element.status == "Waiting for owner response"
      ) {
        color = theme.colors.pending;
        color2 = theme.colors.pending2;
        imageScr = require("../assets/loading.png");
      } else if (element.status == "Expired") {
        color = theme.colors.expired;
        color2 = theme.colors.expired2;
        imageScr = require("../assets/expired.png");
      } else if (element.status == "Cancelled") {
        color = theme.colors.cancelled;
        color2 = theme.colors.cancelled2;
        imageScr = require("../assets/cancelled.png");
      } else if (
        element.status == "Confirmed" ||
        element.status == "Confirmed and done"
      ) {
        color = theme.colors.confirmed;
        color2 = theme.colors.confirmed2;
        imageScr = require("../assets/confirmed.png");
      }
      console.log("indexes", index);
      res.push(
        <TouchableOpacity
          key={index}
          style={{
            margin: 5,
            width: "100%",
            height: 180,
            borderWidth: 2,
            borderRadius: 9,
            borderColor: color,
            backgroundColor: color2,
          }}
          onPress={() => {
            setIndex(index);
            // setModalVisible(true);
            fetchBookingData(index).then(() => {
              // setIndex(index);
              setModalVisible(true);
            });
          }}
        >
          <View
            style={{
              padding: 3,
              width: "100%",
              height: 150,
              flexDirection: "row",
              justifyContent: "space-between",
              // backgroundColor: "white",
              // borderWidth: 1,
            }}
          >
            <View
              style={{
                height: 150,
                width: "40%",
                borderWidth: 2,
              }}
            >
              <Image
                style={{
                  height: "100%",
                  width: "100%",
                }}
                source={
                  element._id2ApartmentImage != ""
                    ? {
                        uri: element._id2ApartmentImage,
                      }
                    : require("../assets/image.png")
                }
                resizeMode="cover"
              />
            </View>
            <View style={{ height: 150, width: "15%" }}>
              <Image
                style={{
                  height: "48%",
                  width: "100%",
                }}
                source={imageScr}
                resizeMode="contain"
              />
              <Image
                style={{ height: "48%", width: "100%" }}
                source={require("../assets/exchangeArrows.png")}
                resizeMode="contain"
              />
            </View>

            <View style={{ height: 150, width: "40%" }}>
              {element.byMoney == true && (
                <View
                  style={{
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold" }}>Money Amount</Text>
                    <Text style={{ fontWeight: "bold" }}>{element.Money}</Text>
                  </View>
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
              {element.byMoney == false && (
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    borderWidth: 2,
                  }}
                >
                  <Image
                    style={{ height: "100%", width: "100%" }}
                    source={
                      element._id1ApartmentImage != ""
                        ? {
                            uri: element._id1ApartmentImage,
                          }
                        : require("../assets/image.png")
                    }
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              // width: "100%",
              // height: 30,
              // position: "relative",
              margin: 5,
              bottom: 0,
            }}
          >
            <Text
              style={{
                textAlignVertical: "center",
                textAlign: "center",
                width: "100%",
                // height: 30,
                backgroundColor: "black",
                opacity: 0.75,
                color: "white",
                fontWeight: "bold",
                borderRadius: 9,
              }}
            >
              {element.status}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
    return res;
  };

  return (
    <Background innerStyle={{ justifyContent: "space-between" }}>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        style={{ width: "100%" }}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {/* <TouchableOpacity
          // style={{ borderWidth: 20 }}
          style={[styles.ScrollView1, { backgroundColor: "white" }]}
          onPress={() => setModalVisible(false)}
        > */}
        <View
          style={{
            // margin: 50,
            width: "100%",
            // borderWidth: 1,
            alignContent: "center",
            alignSelf: "center",
          }}
        >
          <View style={{ height: "100%", width: "100%" }}>
            <ScrollView
              contentContainerStyle={{
                backgroundColor: "white",
                flexGrow: 1,
                justifyContent: "center",
              }}
              showsVerticalScrollIndicator={false}
              style={styles.ScrollView1}
            >
              {bookings.length != 0 && handleBookingModal()}
            </ScrollView>
          </View>
        </View>
        {/* </TouchableOpacity> */}
      </Modal>
      {/*start your code here*/}
      {/* <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search Here"
      /> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
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
        <TouchableOpacity
          onPress={() => {
            console.log("pressed");
            showMessage(TOAST.showBookings);
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
            marginBottom: 1,
            marginTop: 10,
          }}
        >
          <Image
            source={require("../assets/help2.png")}
            style={{ height: 30, width: 30, tintColor: theme.colors.primary }}
          ></Image>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          width: "100%",
          // borderWidth: 1,
          alignItems: "center",
          flexGrow: 1,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
        style={{ alignSelf: "center", width: "100%" }}
      >
        {everyBookingCard()}
      </ScrollView>
      {filterWindow()}
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
          setWarningGoal("");
          setModalVisible(true);
        }}
        onPressYes={() => {
          toCloseError();
          if (warningGoal == "cancelAndRemove") handleCancelAndRemove();
          if (warningGoal == "confirm") handleConfirm();
        }}
      ></Warning>
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
      <FlashMessage position="bottom" floating={true} />
    </Background>
  );
}
const styles = StyleSheet.create({
  locationAndImagesBoxes: {
    flexDirection: "row",
    flex: 1,
    borderWidth: 2,
    borderColor: theme.colors.primaryBorder,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: theme.colors.primaryBackground,
    justifyContent: "center",
    marginBottom: 1,
    marginTop: 10,
  },
  filterBoxTitle: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalView: {
    margin: 15,
    justifyContent: "space-between",
    // alignItems: "center",
    // height: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    elevation: 10,
  },
  header: {
    marginTop: 2,
    backgroundColor: theme.colors.primaryBackground,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: theme.colors.primaryBorder,
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 2,
    borderColor: theme.colors.primaryBorder,
    marginBottom: 10,
  },
  profilePressableButtons: {
    // borderWidth: 2,
    display: "flex",
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
    justifyContent: "center",
    height: 50,
    justifyContent: "flex-end",
    padding: 5,
  },
  // textInputStyle: {
  //   width: "100%",
  //   height: 50,
  //   borderWidth: 2,
  //   borderRadius: 5,
  //   borderColor: theme.colors.primary,
  //   paddingHorizontal: 8,
  //   margin: 5,
  //   backgroundColor: "white",
  // },
});
