import React, { useEffect, useState } from "react";
import Background from "../components/Background";
// import MapView from "react-native-maps";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
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
} from "react-native";
import { Checkbox } from "react-native-paper";
import BackButton from "../components/BackButton";
import { getAllListedApartments } from "../config/cloud";
import Processing from "../components/Processing";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
export default function AvailableApartments({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rooms, setRooms] = useState({ value: "", error: "" });
  const [bedrooms, setBedrooms] = useState({ value: "", error: "" });
  const [bathrooms, setBathrooms] = useState({ value: "", error: "" });
  const [kitchens, setKitchens] = useState({ value: "", error: "" });
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("01/01/01");
  const [toDate, setToDate] = useState("01/01/01");
  const [checked, setChecked] = useState(false);

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
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsProcessing(true);
    try {
      const res = await getAllListedApartments();
      console.log("new res = ", res);
      setApartments([...res]);
      console.log("new apartments = ", apartments);
      console.log("apartmentId = ", apartments[0].apartmentId);
    } catch (error) {
      setIsProcessing(false);
    }
    setIsProcessing(false);
  }
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
        {/* <Text style={{ fontSize: 15, margin: 5 }}>Name</Text>
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
        ></ReactTextInput> */}
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
  const filterWindow = () => {
    return (
      <Modal visible={isModalVisible}>
        <View style={{ justifyContent: "space-between", height: "100%" }}>
          {write()}
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              position: "absolute",
              bottom: 20,
            }}
          >
            <TouchableOpacity
              style={[
                styles.CloseModal,
                { backgroundColor: theme.colors.primary },
              ]}
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
      </Modal>
    );
  };
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      {/*start your code here*/}
      {/* <Text>its AvailableApartments page start your code here</Text> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.ScrollView1}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={{
            width: "100%",
            height: 30,
            marginTop: 50,
            flexDirection: "row",
          }}
        >
          <Text style={{ flex: 3 }}>Filter</Text>
          <Image
            source={require("../assets/filter.png")}
            style={{ height: 30, width: 30 }}
          ></Image>
        </TouchableOpacity>
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
          <Marker
            style={styles.Marker}
            coordinate={{ latitude: 31.769218, longitude: 35.164061 }}
            title={"title"}
            description={"description"}
          >
            <Image
              source={require("..//assets/house1.jpg")}
              style={{ height: 35, width: 35 }}
            ></Image>
          </Marker>
          <Marker
            style={styles.Marker}
            coordinate={{ latitude: 31.762218, longitude: 35.169061 }}
            title={"title"}
            description={"description"}
          >
            <Image
              source={require("..//assets/house2.jpg")}
              style={{ height: 35, width: 35 }}
            ></Image>
          </Marker>
          <Marker
            style={styles.Marker}
            coordinate={{ latitude: 31.762218, longitude: 35.166061 }}
            title={"title"}
            description={"description"}
          >
            <Image
              source={require("..//assets/house3.jpg")}
              style={{ height: 35, width: 35 }}
            ></Image>
          </Marker>
          <Marker
            style={styles.Marker}
            coordinate={{ latitude: 31.768218, longitude: 35.174061 }}
            title={"title"}
            description={"description"}
          >
            <Image
              source={require("..//assets/house4.jpg")}
              style={{ height: 35, width: 35 }}
            ></Image>
          </Marker>
          <Marker
            style={styles.Marker}
            coordinate={{ latitude: 31.763218, longitude: 35.163061 }}
            title={"title"}
            description={"description"}
          >
            <Image
              source={require("..//assets/house5.jpg")}
              style={{ height: 35, width: 35 }}
            ></Image>
          </Marker>
        </MapView>
      </ScrollView>
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
      {filterWindow()}
    </Background>
  );
}
const styles = StyleSheet.create({
  CloseModal: {
    // display: "flex",
    margin: 5,
    flex: 1,
    // borderRadius: 5,
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
    borderWidth: 4,
    // marginTop: 20,
    width: "100%",
    height: "100%",
  },
  marker: {
    width: 12,
    height: 10,
  },
});
