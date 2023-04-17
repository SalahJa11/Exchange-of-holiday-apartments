import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { theme } from "../core/theme";
export default function Error(props) {
  return (
    <Modal visible={props.visible} backdropOpacity={0.7}>
      <View style={styles.alertContainer}>
        <View style={styles.alertContentContainer}>
          <Text style={styles.alertTitleTextStyle}>{props.title}</Text>
          <Text style={styles.alertContentText}>{props.content}</Text>
          <TouchableOpacity
            style={styles.alertCloseButtonStyle}
            onPress={() => {
              props.onPress();
            }}
          >
            <Text style={styles.alertButtonTextStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    zIndex: 5,
  },

  alertContentContainer: {
    width: "70%",
    backgroundColor: "white",
    borderColor: theme.colors.error,
    borderWidth: 3,
    borderRadius: 7,
    padding: 10,
  },

  alertTitleTextStyle: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: theme.colors.error,
  },

  alertContentText: {
    textAlign: "left",
    fontSize: 16,
    marginBottom: 10,
    color: theme.colors.error,
    paddingRight: 8,
  },

  alertCloseButtonStyle: {
    width: "40%",
    height: 50,
    backgroundColor: "white",
    borderColor: theme.colors.error,
    borderWidth: 2,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },

  alertButtonTextStyle: {
    fontSize: 18,
    color: theme.colors.error,
  },
});
