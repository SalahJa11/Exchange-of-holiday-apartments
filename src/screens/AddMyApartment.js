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
} from "react-native";
import { theme } from "../core/theme";
import Error from "../components/Error";
import Warning from "../components/Warning";
import Note from "../components/Note";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Processing from "../components/Processing";
import {
  getMyApartments,
  listApartment,
  removeApartment,
} from "../config/cloud";

export default function AddMyApartment({ navigation }) {
  const [apartments, setApartments] = useState([
    {
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
    },
  ]);
  async function fetchData() {
    setIsProcessing(true);
    try {
      const res = await getMyApartments();
      console.log("new res = ", res);
      setApartments([...res]);
      // console.log("new apartments = ", apartments);
      // console.log("apartmentId = ", apartments[0].apartmentId);
    } catch (error) {
      setIsProcessing(false);
    }
    setIsProcessing(false);
  }
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  const resetValues = () => {
    setRooms({ value: apartments[index].Rooms, error: "" });
    setBathrooms({ value: apartments[index].Bathrooms, error: "" });
    setBedrooms({ value: apartments[index].Bedrooms, error: "" });
    setKitchens({ value: apartments[index].Kitchens, error: "" });
    setName(apartments[index].Name);
    setDescription(apartments[index].Description);
  };
  const googleDateToJavaDate = (
    timestamp = { nanoseconds: 0, seconds: 1676563345 }
  ) => {
    console.log(
      "timestamp = ",
      timestamp,
      " fromDate",
      apartments[index].FromDate
    );
    // return "";
    // timestamp = { nanoseconds: 809000000, seconds: 1676563345 };
    return new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    ).toLocaleDateString("en-US");
  };
  const fixDate = (date, sample = "02/15/23 >> 15/02/2023") => {
    if (typeof date !== "string") return "non";
    let temp = date.split("/");
    return temp[1] + "/" + temp[0] + "/20" + temp[2];
  };

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
        console.log(error);
        setIsProcessing(false);
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
        console.log(error);
        setIsProcessing(false);
      });
    setIsProcessing(false);
    fetchData();
  };
  const ApartmentInfo = () => {
    return (
      <View>
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
          <Text style={{ textAlign: "center" }}>
            {[
              googleDateToJavaDate(apartments[index].FromDate),
              " - ",
              googleDateToJavaDate(apartments[index].ToDate),
            ]}
          </Text>
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
            Rating:{" "}
            {apartments[index].denominator == 0
              ? "0"
              : apartments[index].numerator / apartments[index].denominator}
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
                resetValues();
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
            marginTop: 18,
          }}
        >
          <Image
            style={{
              width: "100%",
              aspectRatio: 1,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              resizeMode: "cover",
            }}
            source={{ uri: element.Image }}
          ></Image>
          {element.Name && (
            <View
              style={{
                backgroundColor: "white",
                opacity: 0.75,
                width: "100%",
                position: "relative",
                bottom: 50,
                paddingLeft: 5,
                paddingRight: 5,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  flex: 3,
                  height: 50,
                  fontSize: 20,
                  textAlignVertical: "center",
                }}
              >
                {element.Name}
              </Text>
              <Text
                style={{
                  flex: 2,
                  height: 50,
                  fontSize: 15,
                  borderLeftWidth: 3,
                  textAlign: "center",
                  textAlignVertical: "center",
                  color: "black",
                }}
              >
                {"Rating "}
                {element.denominator === 0
                  ? "0"
                  : element.numerator / element.denominator}
                {"\n"}
                {element.Listed ? "Listed" : "Not listed"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    });
    return result;
  };
  return (
    <Background style={{ marginTop: 15 }}>
      <BackButton goBack={navigation.goBack} />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              showsVerticalScrollIndicator={false}
              style={styles.ScrollView1}
            >
              {ApartmentInfo()}
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
            fontSize: 35,
            color: "white",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          +
        </Text>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.ScrollView1}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* <TouchableOpacity
          style={{ marginTop: 50, borderWidth: 2 }}
          onPress={() => {
            setErrorTitle("Temp");
            setErrorVisible(true);
          }}
        >
          <Text>Error</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 50, borderWidth: 2 }}
          onPress={() => {
            setErrorTitle("hehe 2 22");
            setErrorVisible(true);
          }}
        >
          <Text>Error2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 50, borderWidth: 2 }}
          onPress={() => {
            setWarningTitle("hellow hehe");
            setWarningVisible(true);
          }}
        >
          <Text>warning</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 50, borderWidth: 2 }}
          onPress={() => {
            setNoteTitle("note hehe");
            setNoteVisible(true);
          }}
        >
          <Text>note</Text>
        </TouchableOpacity> */}
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
    backgroundColor: "green",
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
    padding: 35,
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
