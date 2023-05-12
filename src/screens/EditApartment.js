import React, { useState, useEffect } from "react";
import Background from "../components/Background";
import * as ImagePicker from "expo-image-picker";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Modal,
} from "react-native";
import { TextInput as ReactTextInput } from "react-native";
import BackButton from "../components/BackButton";
import TextInput from "../components/TextInput";
import { Images, theme } from "../core/theme";
import Note from "../components/Note";
import Warning from "../components/Warning";
import Error from "../components/Error";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox } from "react-native-paper";
import { numberValidator } from "../helpers/numberValidator";
import { editApartment } from "../config/cloud";
import Processing from "../components/Processing";
import { fixDate, googleDateToJavaDate } from "../helpers/DateFunctions";
import { showMessage } from "react-native-flash-message";
import { TOAST } from "../core/TOASTText";
export default function EditApartment({ navigation, route }) {
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ uri: "", asset: null });
  const [databaseImagesToDelete, setDatabaseImagesToDelete] = useState([]);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);

  const [apartment, setApartment] = useState(route.params?.paramKey);
  const [imagesUri, setImagesUri] = useState(route.params?.paramKey.Images);
  const [toDeleteImageUri, setToDeleteImageUri] = useState("");
  const [oldImage, setOldImage] = useState(false);

  const [mainImage, setMainImage] = useState(route.params?.paramKey.Image);
  const [imagesAssets, setImagesAssets] = useState([]);
  const [displayImages, setDisplayImages] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState({ value: "", error: "" });
  const [bedrooms, setBedrooms] = useState({ value: "", error: "" });
  const [bathrooms, setBathrooms] = useState({ value: "", error: "" });
  const [kitchens, setKitchens] = useState({ value: "", error: "" });
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState(new Date().getTime());
  const [toDate, setToDate] = useState(new Date().getTime());

  const [checked, setChecked] = useState(false);

  const resetValues = () => {
    setRooms({ value: apartment.Rooms, error: "" });
    setBathrooms({ value: apartment.Bathrooms, error: "" });
    setBedrooms({ value: apartment.Bedrooms, error: "" });
    setKitchens({ value: apartment.Kitchens, error: "" });
    setName(apartment.Name);
    setDescription(apartment.Description);
    setMainImage(apartment.Image);
    console.log(fromDate, toDate);
    setFromDate(googleDateToJavaDate(apartment.FromDate));
    setToDate(googleDateToJavaDate(apartment.ToDate));
    setChecked(apartment.Belcony);
    console.log(fromDate, toDate);
  };

  const [toDeleteImage, setToDeleteImage] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("Error");
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Note");
  const [noteContent, setNoteContent] = useState("Done");
  const [warningVisible, setWarningVisible] = useState(false);
  const [warningTitle, setWarningTitle] = useState("Warning");
  const [warningContent, setWarningContent] = useState("Are you sure?");
  const [warningGoal, setWarningGoal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdateApartment = async () => {
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
    console.log(imagesAssets.length, imagesAssets, imagesUri.length);
    if (imagesAssets.length == 0 && imagesUri.length == 0) {
      error = true;
      errorMessage += "Need at least one image\n";
    }
    if (error == true) {
      // console.log("error");
      setErrorTitle("Error");
      setErrorContent(errorMessage);
      setErrorVisible(true);
      return;
    }
    console.log("start?");
    setIsProcessing(true);
    await editApartment(
      apartment.apartmentId,
      rooms.value,
      bedrooms.value,
      bathrooms.value,
      kitchens.value,
      name,
      description,
      imagesUri,
      mainImage,
      imagesAssets,
      fromDate,
      toDate,
      apartment.Listed,
      checked,
      databaseImagesToDelete
    )
      .then(() => {
        setIsProcessing(false);
        setNoteTitle("Note");
        setNoteContent("Process done successfully");
        setNoteVisible(true);
      })
      .catch((error) => {
        setIsProcessing(false);
        setErrorTitle("Error");
        setErrorContent(error.message);
        setErrorVisible(true);
      });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait().then(() => {
      // handleRefresh().then(() => {
      setIsLoading(false);
      setRefreshing(false);
      // });
    }, []);
  });
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

  useEffect(() => {
    resetValues();
  }, []);
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
    typeof setWarningVisible2 === "function" ? setWarningVisible2(false) : null;
  };
  const ListItem = ({ item }) => {
    console.log(item);
    return (
      <TouchableOpacity
        onLongPress={() => {
          setSelectedImage({ uri: item.uri, asset: item });
          setIsModalVisible(true);
        }}
      >
        <Image
          source={{
            uri: item.uri,
          }}
          style={{ width: 140, height: 140, margin: 2 }}
          resizeMode="cover"
        />
        {/* <Text style={{}}>Hi</Text> */}
      </TouchableOpacity>
    );
  };
  const ListItemEdit = ({ item }) => {
    return (
      <TouchableOpacity
        onLongPress={() => {
          setIsModalVisible(true);
          setSelectedImage({ uri: item, asset: null });
          // removeSelectedImageUri(item);
        }}
      >
        <Image
          source={{
            uri: item,
          }}
          style={{ width: 140, height: 140, margin: 2 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
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
              // defaultValue={apartments[index].Rooms}
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
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}
          />
        </View>
      </View>
    );
  };
  // const removeSelectedImageUri = (item, toDelete = false) => {
  //   let temp = [...imagesUri];
  //   var idx = temp.indexOf(item);
  //   console.log("var = >", idx);
  //   if (idx != -1) temp.splice(idx, 1);

  //   setWarningTitle("Warning");
  //   setWarningContent("Are you sure you want to remove image ?");
  //   setOldImage(true);
  //   setWarningVisible2(true);
  //   console.log(item);
  //   setToDeleteImageUri(item);
  //   if (toDelete) {
  //     setImagesUri(temp);
  //   }
  // };
  const resetMainImage = (array = imagesUri, array2 = imagesAssets) => {
    // console.log(
    //   "imagesUri.length >= 1",
    //   imagesUri.length >= 1,
    //   "imagesAssets.length >= 1",
    //   imagesAssets.length >= 1,
    //   imagesUri
    // );
    if (array.length >= 1) setMainImage(array[0]);
    else if (array2.length >= 1) setMainImage(array2[0].uri);
    else setMainImage("");
  };
  const deleteImage = () => {
    let temp = [...imagesAssets];
    var idx = temp.indexOf(selectedImage.asset);
    console.log("var = >", idx);
    if (idx != -1) temp.splice(idx, 1);
    setImagesAssets(temp);
    if (temp.length == 0) setDisplayImages(false);
    let temp2 = [...imagesUri];
    var idx = temp2.indexOf(selectedImage.uri);
    console.log("var = >", idx);
    if (idx != -1) {
      temp2.splice(idx, 1);
      setDatabaseImagesToDelete([...databaseImagesToDelete, selectedImage.uri]);
    }
    setImagesUri([...temp2]);
    console.log("temp = ", temp2);
    console.log(
      "if statement",
      selectedImage.uri == mainImage,
      selectedImage.uri,
      mainImage
    );
    if (selectedImage.uri == mainImage) resetMainImage(temp2, temp);
  };
  // const removeSelectedImage = (item, toDelete = false) => {
  //   let temp = [...imagesAssets];
  //   var idx = temp.indexOf(item);
  //   console.log("var = >", idx);
  //   if (idx != -1) temp.splice(idx, 1);

  //   setWarningTitle("Warning");
  //   setWarningContent("Are you sure you want to remove image ?");
  //   setOldImage(false);
  //   setWarningVisible2(true);

  //   setToDeleteImage(item);
  //   if (toDelete) {
  //     setImagesAssets(temp);
  //     // setImagesAssets(imagesAssets);
  //     if (temp.length == 0) setDisplayImages(false);
  //   }
  // };
  const startPicking = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      console.log(result);
      // setImage(result.assets[0].uri);
      let temp = [...imagesAssets, ...result.assets];
      let uniqueArray = temp.filter((obj, index, self) => {
        return (
          index ===
          self.findIndex((o) => {
            return o.assetId === obj.assetId;
          })
        );
      });
      // console.log(temp, uniqueArray);
      uniqueArray = uniqueArray.filter((item) => typeof item !== "string");
      setImagesAssets(uniqueArray);
      setDisplayImages(true);
      if (mainImage === "") {
        resetMainImage(imagesUri, uniqueArray);
      }
    }
  };
  const pickImage = async () => {
    if (status.granted === false)
      await requestPermission().then(async (res) => {
        if (res.granted) {
          await startPicking();
        } else {
          setErrorTitle("Error");
          setErrorContent(
            "You've refused to allow this app to access your photos!"
          );
          setErrorVisible(true);
        }
      });
    else {
      await startPicking();
    }
  };
  // const pickImage2 = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsMultipleSelection: true,
  //     aspect: [1, 1],
  //   });
  //   if (!result.canceled) {
  //     console.log(result);
  //     // setImage(result.assets[0].uri);
  //     let temp = [...imagesAssets, ...result.assets];
  //     let uniqueArray = temp.filter((obj, index, self) => {
  //       return (
  //         index ===
  //         self.findIndex((o) => {
  //           return o.assetId === obj.assetId;
  //         })
  //       );
  //     });
  //     // console.log(temp, uniqueArray);
  //     uniqueArray = uniqueArray.filter((item) => typeof item !== "string");
  //     setImagesAssets(uniqueArray);
  //     setDisplayImages(true);
  //   } else {
  //     // setImagesAssets([]);
  //     // setDisplayImages(false);
  //   }
  // };
  const getImages = () => {
    pickImage();
  };
  const AddNewImages = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={getImages}
            style={[styles.locationAndImagesBoxes, { flex: 1 }]}
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
                showMessage(TOAST.EditApartment);
              }}
              style={{
                alignItems: "center",
                flex: 0.1,
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
          <>
            <View
              style={{
                width: "100%",
                height: 190,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: theme.colors.primary,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setWarningTitle("Warning");
                  setWarningContent(
                    "Are you sure you want to remove all images ?"
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
              <Text
                style={{ textAlignVertical: "center", textAlign: "center" }}
              >
                Long press on image to remove
              </Text>
              <FlatList
                nestedScrollEnabled
                horizontal
                data={imagesAssets}
                renderItem={({ item }) => <ListItem item={item} />}
              ></FlatList>
            </View>
          </>
        )}
      </View>
    );
  };

  const ApartmentEditInfo = () => (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      showsVerticalScrollIndicator={false}
      style={styles.ScrollView1}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <Text style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}>
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
            <Text style={{ textAlign: "center", textAlignVertical: "center" }}>
              From
            </Text>
            <Text style={{ textAlign: "center", textAlignVertical: "center" }}>
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
            <Text style={{ textAlign: "center", textAlignVertical: "center" }}>
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

        {/* {(showPicker2 || showPicker) && (
          <DateTimePicker
            // dateFormat="DD-MM-YYYY"
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(value) =>
              handleDateChange(null, value.nativeEvent.timestamp)
            }
          />
        )} */}
      </View>

      <Text style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}>
        Information
      </Text>
      {write()}
      {imagesUri.length !== 0 && (
        <View
          style={{
            width: "100%",
            height: 190,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: theme.colors.primary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={{
                textAlignVertical: "center",
                flex: 1,
                fontSize: 20,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Images
            </Text>

            <TouchableOpacity
              onPress={() => {
                console.log("pressed");
                showMessage(TOAST.EditApartment);
              }}
              style={{
                alignItems: "center",
                flex: 0.1,
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
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            horizontal
            data={imagesUri}
            renderItem={({ item }) => <ListItemEdit item={item} />}
          ></FlatList>
        </View>
      )}
      <View style={{ width: "100%", height: 150, flexDirection: "row" }}>
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            fontWeight: "bold",
            flex: 1,
            textAlignVertical: "center",
          }}
        >
          Main Image
        </Text>
        <Image
          source={
            mainImage !== ""
              ? { uri: mainImage }
              : require("../assets/image.png")
          }
          style={{ width: 140, height: 140, margin: 2, flex: 2 }}
          resizeMode="contain"
        ></Image>
      </View>
      {AddNewImages()}
      <View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.profilePressableButtons}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.profilePressableButtons,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => {
              handleUpdateApartment();
            }}
          >
            <Text style={styles.textStyle}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
  const imageOptions = () => {
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
          <ScrollView>
            <View
              style={{
                width: "100%",
                aspectRatio: 1,
                borderWidth: 2,
                borderRadius: 5,
                backgroundColor: theme.colors.primaryBackground,
                borderColor: theme.colors.primaryBorder,
                padding: 2,
              }}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                source={
                  selectedImage.uri == ""
                    ? require("../assets/image.png")
                    : { uri: selectedImage.uri }
                }
                resizeMode="contain"
              />
            </View>
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
                  setIsModalVisible(false);
                  setMainImage(selectedImage.uri);
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
                  Set main image
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.CloseModal}
                onPress={() => {
                  setIsModalVisible(false);
                  setWarningVisible(true);
                  setWarningContent("Are you sure you want to remove image ?");
                  setWarningGoal("deletion");
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
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                alignSelf: "center",
                backgroundColor: theme.colors.primary,
                width: "90%",
                height: 40,
                justifyContent: "center",
                borderRadius: 5,
              }}
              onPress={() => {
                // setApartments(apartmentsTemp);
                // clearValues();
                // setFiltered(false);
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
                Cancel
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  };
  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}

      {/*start your code here*/}
      {/* <View style={{ height: 50 }}>
        <Text style={{ fontSize: 30 }}>Edit page</Text>
      </View> */}
      {ApartmentEditInfo()}
      {imageOptions()}
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
          navigation.goBack();
        }}
      ></Note>
      <Warning
        // style={{ zIndex: 1 }}
        visible={warningVisible}
        title={warningTitle}
        content={warningContent}
        onPressCancel={() => {
          toCloseError();
        }}
        onPressYes={() => {
          toCloseError();
          if (warningGoal == "deletion") {
            deleteImage();
          } else if (warningGoal == "clearImages") {
            setImagesAssets([]);
            setDisplayImages(false);
            let res = imagesAssets.find((item) => item.uri === mainImage);
            if (res) {
              resetMainImage(imagesUri, []);
            }
          }
        }}
      ></Warning>
      {/* <Warning
        // style={{ zIndex: 1 }}
        visible={warningVisible2}
        title={"Note"}
        content={"Set as main image or delete image"}
        CancelText={"Set main image"}
        YesText={"Delete"}
        onPressCancel={() => {
          oldImage
            ? setMainImage(toDeleteImageUri)
            : setMainImage(toDeleteImage.uri);
          toCloseError();
        }}
        onPressYes={() => {
          toCloseError();
          console.log("yes pressed");
          toCloseError();
          setWarningVisible(true);
        }}
      ></Warning> */}
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
    </Background>
  );
}
const styles = StyleSheet.create({
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
  textStyle: {
    textAlignVertical: "center",
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
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
  ScrollView1: {
    height: "100%",
    width: "100%",
  },
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
});
