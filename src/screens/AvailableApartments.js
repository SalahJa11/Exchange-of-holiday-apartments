import React, { useEffect, useState } from "react";
import Background from "../components/Background";
// import MapView from "react-native-maps";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Marker } from "react-native-maps";
import { Image, StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { getAllListedApartments } from "../config/cloud";
import Processing from "../components/Processing";
export default function AvailableApartments({ navigation }) {
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

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      {/*start your code here*/}
      {/* <Text>its AvailableApartments page start your code here</Text> */}
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
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
    </Background>
  );
}
const styles = StyleSheet.create({
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
