import { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput as ReactTextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Modal,
} from "react-native";
import {
  getAllListedApartments,
  getAllUsers,
  getChatId,
  startAChat,
} from "../config/cloud";
import Background from "../components/Background";
import Error from "../components/Error";
import { theme } from "../core/theme";
import { Avatar } from "react-native-elements";
import Processing from "../components/Processing";
import { Checkbox } from "react-native-paper";

import { numberValidatorAndEmpty } from "../helpers/numberValidatorAndEmpty";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { fixDate, googleDateToJavaDate } from "../helpers/DateFunctions";
import TextInput from "../components/TextInput";

export default function SearchUsersAndApartments({ navigation, route }) {
  const [type, setType] = useState(route.params?.type);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("error");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [dataArrayTemp, setDataArrayTemp] = useState([]);
  const [search, setSearch] = useState("");
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
  const [fromDate, setFromDate] = useState(new Date().getTime());
  const [toDate, setToDate] = useState(new Date().getTime());
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);
  const [filterDate, setFilterDate] = useState(false);
  const [checked, setChecked] = useState(false);
  // const [apartmentsTemp, setApartmentsTemp] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };

  useEffect(() => {
    if (type === "users") {
      navigation.setOptions({
        title: "New conversation",
      });
    }
    if (type === "apartments") {
      navigation.setOptions({
        title: "Available apartments",
      });
    }
    fetchData();
  }, []);
  async function fetchData() {
    setIsProcessing(true);
    try {
      if (type === "users")
        await getAllUsers().then((res) => {
          setDataArray([...res]);
          setDataArrayTemp([...res]);
          // styleHeader("New conversation");
        });
      else if (type === "apartments")
        await getAllListedApartments().then((res) => {
          setDataArray([...res]);
          setDataArrayTemp([...res]);
          // styleHeader("Available apartments");
        });
      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  }

  const listChatUsers = () => {
    let result = [];
    dataArray.forEach((user, index) => {
      let temp = (
        <TouchableOpacity
          style={{ marginBottom: 5 }}
          key={index}
          onPress={async () => {
            await startAChat(user.id).then((newChatId) => {
              navigation.navigate("Chating", {
                paramKey: getChatId(user.id),
                paramKeyEmail: user.email,
                paramKeyImage: user.image,
                paramKeyProfile: user,
                paramKeyName: user.name,
              });
            });
          }}
        >
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
            }}
          >
            <Avatar
              rounded
              size="medium"
              source={{
                uri: user.image,
              }}
            />
            <Text
              style={{
                width: "100%",
                textAlignVertical: "center",
                textAlign: "left",
                marginLeft: 20,
                fontSize: 16,
              }}
            >
              {user.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
      result.push(temp);
    });
    return result;
  };
  const listApartments = () => {
    let result = [];
    dataArray.forEach((apartment, index) => {
      let temp = (
        <TouchableOpacity
          style={{ marginBottom: 5 }}
          key={index}
          onPress={() => {
            navigation.navigate("ApartmentInfo", {
              paramKey: apartment,
            });
          }}
        >
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
            }}
          >
            <Avatar
              rounded
              size="medium"
              source={{
                uri: apartment.Image,
              }}
            />
            <Text
              style={{
                width: "100%",
                textAlignVertical: "center",
                textAlign: "left",
                marginLeft: 20,
                fontSize: 16,
              }}
            >
              {apartment.Name === ""
                ? "Not Named"
                : apartment.Name.length > 30
                ? apartment.Name.slice(0, 30) + "..."
                : apartment.Name}
            </Text>
          </View>
        </TouchableOpacity>
      );
      result.push(temp);
    });
    return result;
  };
  const listAll = () => {
    if (type === "users") {
      return listChatUsers();
    }
    if (type === "apartments") {
      return listApartments();
    }
    return;
  };
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = dataArrayTemp.filter(function (item) {
        if (type === "apartments") item.name = item.Name;
        // Applying filter for the inserted text in search bar
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataArray(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setDataArray(dataArrayTemp);
      setSearch(text);
    }
  };
  /////////////////////////////// apartments filter
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
    setFilterDate(false);
    setChecked(false);
  }
  function isInsideDate(apartment) {
    let apartmentFromTime = new Date(
      googleDateToJavaDate(apartment.FromDate)
    ).setHours(0, 0, 0, 0);
    let apartmentToTime = new Date(
      googleDateToJavaDate(apartment.ToDate)
    ).setHours(23, 59, 59, 999);
    if (apartmentFromTime <= fromDate && toDate <= apartmentToTime) return true;
    return false;
  }
  function isBetween(str1, strbetween, str2) {
    console.log("(str1, strbetween, str2)", str1, ",", strbetween, ",", str2);
    if (strbetween === "") return true;
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
    if (checked === true && value.Belcony !== checked) return false;
    if (filterDate === true && !isInsideDate(value)) return false;
    return true;
  }
  function checkEmptyFilter() {
    if (rooms.value !== "") return false;
    if (bedrooms.value !== "") return false;
    if (bathrooms.value !== "") return false;
    if (kitchens.value !== "") return false;
    if (roomsTo.value !== "") return false;
    if (bedroomsTo.value !== "") return false;
    if (bathroomsTo.value !== "") return false;
    if (kitchensTo.value !== "") return false;
    if (checked) return false;
    if (filterDate) return false;
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
    setDataArray([...dataArrayTemp].filter(filterArray));

    setFiltered(true);
    if (checkEmptyFilter()) setFiltered(false);
    setIsModalVisible(false);
    // setIndx
  };
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
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.filterBoxTitle}>Filter by date?</Text>
            <Checkbox
              style={{ alignSelf: "center" }}
              status={filterDate ? "checked" : "unchecked"}
              onPress={() => {
                setFilterDate(!filterDate);
              }}
            />
          </View>
          {filterDate && (
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
          )}
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
                  backgroundColor: theme.colors.primaryBorder,
                  width: "100%",
                  height: 40,
                  justifyContent: "center",
                  borderRadius: 5,
                }}
                onPress={() => {
                  setDataArray(dataArrayTemp);
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
  /////////////////////////////// apartments filter
  return (
    <Background innerStyle={{ justifyContent: "space-between" }}>
      {/* <BackButton goBack={navigation.goBack} /> */}

      {/*start your code here*/}
      {/* <Text>its Chating page start your code here{JSON.stringify(chats)}</Text> */}

      <ReactTextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search Here"
      />
      {type === "apartments" && (
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
      )}
      <ScrollView style={{ width: "100%", height: "100%" }}>
        {listAll()}
      </ScrollView>
      {type === "apartments" && filterWindow()}
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
  textInputStyle: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: theme.colors.primary,
    paddingHorizontal: 8,
    margin: 5,
    backgroundColor: "white",
  },
  plusSignOpView: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    zIndex: 1,
  },
});
