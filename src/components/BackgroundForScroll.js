import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { theme } from "../core/theme";

const BackgroundForScroll = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : ""}
      style={styles.backgroundContainer}
    >
      <View style={styles.backgroundContentContainer}>{children}</View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundContentContainer: {
    width: "100%",
    height: "100%",
    // maxWidth: 400,
    padding: 5,
    backgroundColor: theme.colors.surface,
    // borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BackgroundForScroll;
