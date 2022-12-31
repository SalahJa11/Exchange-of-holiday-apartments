import React, { useState } from "react";

import Background from "../components/Background";
import BackButton from "../components/BackButton";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { theme } from "../core/theme";
export default function AddMyApartment({ navigation }) {
  const [ChangedData, SetChangedData] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apartment", value: 1 },
    { label: "House", value: 2 },
  ]);

  // let houseType = [];
  // houseType.push({ label: "Apartment", value: 1 });
  // setItems(houseType);
  // React.useEffect(() => {})
  const write = (title) => {
    return (
      <View style={styles.write}>
        <Text style={styles.writeText}>{title}</Text>
        <TextInput style={styles.writeInput}></TextInput>
      </View>
    );
  };
  const Form = () => {
    return (
      <View>
        <DropDownPicker
          style={{
            borderColor: "#1c6669",
            borderBottomWidth: 2,
          }}
          textStyle={{
            fontSize: 15,
          }}
          showTickIcon={false}
          placeholder="House Type"
          containerStyle={styles.dropDownStyle}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        {write("Rooms")}
        {write("Floors")}
        {write("Kitchens")}
        {write("Bathrooms")}
        {write("Rooms")}
        {write("Floors")}
        {write("Kitchens")}
        {write("Bathrooms")}
        {write("Rooms")}
        {write("Floors")}
        {write("Kitchens")}
        {write("Bathrooms")}
        {write("Rooms")}
        {write("Floors")}
        {write("Kitchens")}
        {write("Bathrooms")}
      </View>
    );
  };
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <ScrollView
        style={styles.ScrollView1}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.View2}>
          {Form()}
          {/*start your code here*/}
          <Text>its AddMyApartment page start your code here</Text>
        </View>
      </ScrollView>
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
});
