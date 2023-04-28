import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Logo() {
  return <Image source={require("../assets/logo.png")} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    // marginBottom: 5,
  },
});
