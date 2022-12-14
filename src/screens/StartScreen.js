import React from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { Dimensions, View, ScrollView, StyleSheet } from "react-native";

export default function StartScreen({ navigation }) {
  return (
    <Background>
      {/* <View style={styles.View0}> */}
      <ScrollView
        style={styles.ScrollView1}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.View2}>
          <Logo />
          <Header>Apartment Exchange</Header>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("LoginScreen")}
          >
            Login
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            Sign Up
          </Button>
        </View>
      </ScrollView>
      {/* </View> */}
    </Background>
  );
}
const styles = StyleSheet.create({
  // View0: { alignItems: "center", flex: 1 },
  // ScrollView1: {
  //   borderColor: "black",
  //   borderWidth: 2,
  //   width: "100%",
  //   // height: "100%",
  //   borderRadius: 5,
  //   alignContent: "center",
  //   flex: 9,
  // },
  ScrollView1: {
    height: "100%",
    width: "100%",
  },
  // mainContainer: {
  //   flex: 1,
  // },
  scrollViewContainer: {},
  View2: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "space-around",
    flex: 1,
    // // position: "relative",
    // height: Dimensions.get("window").height / 1.5,
    // alignSelf: "center",
    // alignContent: "space-around",
    // width: "100%",
    // height: "100%",
    // borderColor: "black",
    // borderWidth: 2,

    // borderRadius: 2,
  },
});
