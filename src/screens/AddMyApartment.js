import React, { useEffect, useState } from "react";
// import { FAB } from "react-native-elements";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import { theme } from "../core/theme";
import Error from "../components/Error";
import Warning from "../components/Warning";
import Note from "../components/Note";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Processing from "../components/Processing";
import {
  getMyApartments,
  listApartment,
  removeApartment,
} from "../config/cloud";
import { fixDate, googleDateToJavaDate } from "../helpers/DateFunctions";

export default function AddMyApartment({ navigation }) {
  // const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [apartmentsTemp, setApartmentsTemp] = useState([]);
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
    //   Images: [],
    //   Image:
    //     "https://firebasestorage.googleapis.com/v0/b/exchange-of-holiday-apar-45a07.appspot.com/o/image.png?alt=media&token=6eece138-9574-479e-a1c7-cf3316a88eda",
    // },
  ]);
  const saveStatus = (apartmentsArray) => {
    // console.log("apartmentsArrayLength = ", apartmentsArray.length, apartmentsArray);
    const dateTemp = new Date().setHours(0, 0, 0, 0);
    const res = apartmentsArray.map((element) => {
      let newElement = { ...element };
      if (element.booked) {
        newElement.status = "Booked";
        console.log("Booked");
      } else if (
        new Date(googleDateToJavaDate(element.ToDate)).setHours(0, 0, 0, 0) <
        dateTemp
      ) {
        newElement.status = "Expired";
        console.log("Expired");
      } else if (element.Listed) {
        newElement.status = "Listed";
        console.log("Listed");
      } else {
        newElement.status = "Not Listed";
        console.log("Not Listed");
      }
      console.log("i");
      return newElement;
    });
    // console.log(res);
    return res;
  };
  async function fetchData() {
    setIsProcessing(true);
    try {
      const res = await getMyApartments();
      console.log("new res = ", res);
      let temp = [...res];
      temp = saveStatus(temp);
      temp.sort(function (x, y) {
        return x.createdAt - y.createdAt;
      });
      temp = temp.reverse();
      setApartments([...temp]);
      setApartmentsTemp([...temp]);
      // console.log("new apartments = ", apartments);
      // console.log("apartmentId = ", apartments[0].apartmentId);
    } catch (error) {
      setIsProcessing(false);
      setModalVisible(false);
      setErrorTitle("Error");
      setErrorContent(error.message);
      setErrorVisible(true);
    }
    setIsProcessing(false);
  }
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    if (isFocused) fetchData();
  }, [isFocused]);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("error");
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Note");
  const [noteContent, setNoteContent] = useState("Done");
  const [warningVisible, setWarningVisible] = useState(false);
  const [warningTitle, setWarningTitle] = useState("Warning");
  const [warningContent, setWarningContent] = useState("Are you sure?");
  const [warningGoal, setWarningGoal] = useState("");

  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : None;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : None;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : None;
  };
  // const resetValues = () => {
  //   setRooms({ value: apartments[index].Rooms, error: "" });
  //   setBathrooms({ value: apartments[index].Bathrooms, error: "" });
  //   setBedrooms({ value: apartments[index].Bedrooms, error: "" });
  //   setKitchens({ value: apartments[index].Kitchens, error: "" });
  //   setName(apartments[index].Name);
  //   setDescription(apartments[index].Description);
  // };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait().then(() => {
      fetchData().then(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
    }, []);
  });
  const ListItem = ({ item }) => {
    return (
      <View>
        <Image
          source={{
            uri: item,
          }}
          style={{ width: 140, height: 140, margin: 2 }}
          resizeMode="cover"
        />
        {/* <Text style={{}}>Hi</Text> */}
      </View>
    );
  };
  const handleDeleting = async (apartmentId) => {
    setIsProcessing(true);
    await removeApartment(apartmentId)
      .then(() => {
        setIsProcessing(false);
        setNoteTitle("Note");
        setNoteContent("Process done successfully");
        setNoteVisible(true);
      })
      .catch((error) => {
        setIsProcessing(false);
        setModalVisible(false);
        setErrorTitle("Error");
        setErrorContent(error.message);
        setErrorVisible(true);
      });
    setIsProcessing(false);
    fetchData();
  };
  const checkDatesError = () => {
    let totime = new Date(
      googleDateToJavaDate(apartments[index].ToDate)
    ).getTime();
    console.log("TIME", new Date().getTime(), totime);
    console.log(
      "TIME2",
      new Date(new Date().toLocaleDateString()),
      new Date(googleDateToJavaDate(apartments[index].ToDate))
    );
    if (new Date(new Date().toLocaleDateString()).getTime() > totime)
      return true;
    return false;
  };
  const handleListing = async (id, toList) => {
    const dateError = checkDatesError();
    if (!apartments[index].Listed && dateError) {
      setModalVisible(false);
      setErrorTitle("Error");
      setErrorContent("Please check available dates");
      setErrorVisible(true);
      return "";
    }
    setIsProcessing(true);
    await listApartment(id, toList)
      .then(() => {
        setIsProcessing(false);
        setNoteTitle("Note");
        setNoteContent("Process done successfully");
        setNoteVisible(true);
      })
      .catch((error) => {
        setIsProcessing(false);
        setModalVisible(false);
        setErrorTitle("Error");
        setErrorContent(error.message);
        setErrorVisible(true);
      });
    setIsProcessing(false);
    fetchData();
  };
  const ApartmentInfo = () => {
    return (
      <View
        style={{
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
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
                {fixDate(googleDateToJavaDate(apartments[index].FromDate))}
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
                {fixDate(googleDateToJavaDate(apartments[index].ToDate))}
              </Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}>
          Information
        </Text>
        <View style={{ flex: 2 }}>
          <Text style={{ fontSize: 15 }}>Name: {apartments[index].Name}</Text>
          <Text style={styles.ProfileDetails}>
            Type: {apartments[index].Type}
          </Text>
          <Text style={styles.ProfileDetails}>
            Rooms: {apartments[index].Rooms}
          </Text>
          <Text style={styles.ProfileDetails}>
            BedRooms: {apartments[index].Bedrooms}
          </Text>
          <Text style={styles.ProfileDetails}>
            Bathrooms: {apartments[index].Bathrooms}
          </Text>
          <Text style={styles.ProfileDetails}>
            Kitchens: {apartments[index].Kitchens}
          </Text>
          <Text style={styles.ProfileDetails}>
            {apartments[index].Belcony ? "Belcony: exist" : "No belcony"}
          </Text>
          <Text style={styles.ProfileDetails}>
            Rating: {apartments[index].Rating}
          </Text>
        </View>
        {apartments[index].Description !== "" && (
          <View>
            <Text
              style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}
            >
              Description
            </Text>
            <Text style={[styles.ProfileDetails]}>
              {apartments[index].Description}
            </Text>
          </View>
        )}
        <View style={{ flex: 2 }}>
          <Text
            style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}
          >
            Images
          </Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            horizontal
            data={apartments[index].Images}
            renderItem={({ item }) => <ListItem item={item} />}
          ></FlatList>
        </View>

        <View>
          <Text
            style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}
          >
            Location
          </Text>
          <View style={{ width: "100%", height: 150 }}>
            <MapView
              scrollEnabled={false}
              initialRegion={{
                latitude: apartments[index].Location[0],
                longitude: apartments[index].Location[1],
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
                  latitude: apartments[index].Location[0],
                  longitude: apartments[index].Location[1],
                }}
                title={"title"}
                description={"description"}
              ></Marker>
            </MapView>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.profilePressableButtons,
                { backgroundColor: "green" },
              ]}
              onPress={() => {
                setModalVisible(false);
                setWarningContent("Are you sure?");
                setWarningTitle("Warning");
                setWarningGoal("List");
                setWarningVisible(true);
              }}
            >
              {apartments[index].Listed ? (
                <Text style={styles.textStyle}>
                  Unlist {apartments[index].Type}
                </Text>
              ) : (
                <Text style={styles.textStyle}>
                  List {apartments[index].Type}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.profilePressableButtons,
                { backgroundColor: "purple" },
              ]}
              onPress={() => {
                navigation.navigate("EditApartment", {
                  paramKey: apartments[index],
                });
                setModalVisible(false);
                // resetValues();
                // setToEdit(true);
              }}
            >
              <Text style={styles.textStyle}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.profilePressableButtons}
              onPress={() => {
                setModalVisible(false);
                setWarningContent("Are you sure?");
                setWarningTitle("Warning");
                setWarningGoal("Delete");
                setWarningVisible(true);
              }}
            >
              <Text style={styles.textStyle}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.profilePressableButtons,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const everyHouseCard = () => {
    let result = [];
    apartments.forEach((element, index) => {
      result.push(
        <TouchableOpacity
          activeOpacity={0.8}
          key={index}
          onLongPress={() => {
            setIndex(index);
            console.log("expectedApartment", apartments[index]);
            setModalVisible(true);
          }}
          style={{
            width: "100%",
            aspectRatio: 1,
            marginVertical: 8,
          }}
        >
          <Image
            style={{
              width: "100%",
              aspectRatio: 1,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              resizeMode: "cover",
            }}
            source={{ uri: element.Image }}
          ></Image>
          {element.Name && (
            <View
              style={{
                backgroundColor: "black",
                opacity: 0.75,
                width: "100%",
                position: "relative",
                bottom: 50,
                paddingLeft: 10,
                paddingRight: 10,
                flexDirection: "row",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
            >
              <Text
                style={{
                  flex: 3,
                  height: 50,
                  fontSize: 20,
                  textAlignVertical: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {element.Name.slice(0, 30)}
              </Text>
              <Text
                style={{
                  flex: 2,
                  height: 50,
                  fontSize: 15,
                  borderLeftWidth: 3,
                  borderColor: "white",
                  textAlign: "center",
                  textAlignVertical: "center",
                  color: "white",
                }}
              >
                {"Rating "}
                {element.Rating}
                {"\n"}
                {element.status}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    });
    return result;
  };
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = apartmentsTemp.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.Name ? item.Name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setApartments(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setApartments(apartmentsTemp);
      setSearch(text);
    }
  };
  return (
    <Background style={{ marginTop: 15 }}>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              showsVerticalScrollIndicator={false}
              style={styles.ScrollView1}
            >
              {apartments.length > 0 ? ApartmentInfo() : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.plusSignOpView}
        onPress={() => navigation.navigate("AddMyApartmentForm")}
      >
        <Text
          style={{
            fontSize: 40,
            color: "white",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          +
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search (by name) Here"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.ScrollView1}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.View2}>{everyHouseCard()}</View>
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
          setModalVisible(true);
        }}
        onPressYes={() => {
          toCloseError();
          console.log("yes pressed");
          // removeSelectedImage(toDeleteImage, true);
          warningGoal === "List"
            ? handleListing(
                apartments[index].apartmentId,
                !apartments[index].Listed
              )
            : warningGoal === "Delete"
            ? handleDeleting(apartments[index].apartmentId)
            : null;

          // setModalVisible(true);
        }}
      ></Warning>
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
    </Background>
  );
}

const styles = StyleSheet.create({
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
  ScrollView1: {
    height: "100%",
    width: "100%",
  },
  View2: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "space-around",
    flex: 1,
  },
  dropDownStyle: {
    // borderTopWidth: 2,
    marginTop: 4,
    width: "95%",
    alignSelf: "center",
  },
  DropContainer: {
    width: "100%",
    borderTopWidth: 2,
  },
  write: {
    width: "100%",
    flexDirection: "row",
    height: 50,
    padding: 5,
  },
  writeText: {
    // textAlign: "center",
    flex: 1,
  },
  writeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  houseCardView: {
    width: "100%",
    minHeight: 150,
    borderWidth: 2,
    margin: 2,
  },
  houseCardImageView: {
    width: "100%",
    flex: 1,
  },
  houseCardDescriptionView: {
    width: "100%",
    // alignSelf: "center",
    alignItems: "center",
    // flex: 1,
    // maxHeight: 50,
    backgroundColor: "white",
    opacity: 90,
    // position: "relative",
    // height: "100%",
  },
  houseCardMainImage: {
    width: "100%",
    height: "100%",
    // resizeMode: "contain",
  },
  floatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50,
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    height: 30,
    textAlignVertical: "center",
    borderRadius: 10,
    margin: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
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
  profilePressableButtons: {
    display: "flex",
    margin: 5,
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#fd0000",
    height: 50,
    justifyContent: "center",
  },
});
