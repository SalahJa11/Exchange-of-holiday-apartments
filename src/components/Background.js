import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { theme } from "../core/theme";

export default function Background({ children, innerStyle }) {
  return (
    <ImageBackground
      source={require("../assets/background_dot.png")}
      resizeMode="repeat"
      style={[styles.background]}
    >
      <View style={[styles.container, { ...innerStyle }]} behavior="padding">
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
    // maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 7,
  },
});
