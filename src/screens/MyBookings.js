import React from "react";
import Background from "../components/Background";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
export default function MyBookings({ navigation }) {
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />

      {/*start your code here*/}
      <Text>its MyBookings page start your code here</Text>
    </Background>
  );
}
const styles = StyleSheet.create({});
