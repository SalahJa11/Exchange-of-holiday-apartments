import React from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { Modal } from "react-native-paper";
import { theme } from "../core/theme";
export default function Processing(props) {
  return (
    <Modal visible={props.visible}>
      <View style={styles.processingAlertContainer}>
        <View style={styles.processingAlertContentContainer}>
          <Text style={styles.processingAlertTextStyle}>{props.content}</Text>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  processingAlertContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  processingAlertContentContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 3,
    borderColor: "#1c6669",
  },

  processingAlertTextStyle: {
    fontSize: 20,
    marginRight: 15,
  },
});
