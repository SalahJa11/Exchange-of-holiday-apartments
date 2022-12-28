import React from "react";
import Background from "../components/Background";
import MapView from "react-native-maps";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
export default function AvailableApartments({ navigation }) {
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      {/*start your code here*/}
      <Text>its AvailableApartments page start your code here</Text>
      <MapView style={styles.map} />
    </Background>
  );
}
const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
