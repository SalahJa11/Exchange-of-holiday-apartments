import React from "react";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { Text } from "react-native";
export default function AddMyApartment({ navigation }) {
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      {/*start your code here*/}
      <Text>its AddMyApartment page start your code here</Text>
    </Background>
  );
}
