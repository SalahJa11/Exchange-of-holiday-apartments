import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { theme } from "../core/theme";
export default function Warning(props) {
  return (
    <Modal visible={props.visible} backdropOpacity={0.7}>
      <View style={styles.alertContainer}>
        <View style={styles.alertContentContainer}>
          <Text style={styles.alertTitleTextStyle}>{props.title}</Text>
          <Text style={styles.alertContentText}>{props.content}</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <TouchableOpacity
              style={styles.alertCloseButtonStyle}
              onPress={() => {
                props.onPressCancel();
              }}
            >
              <Text style={styles.alertButtonTextStyle}>
                {props.CancelText ? props.CancelText : "Cancel"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.alertCloseButtonStyle}
              onPress={() => {
                props.onPressYes();
              }}
            >
              <Text style={styles.alertButtonTextStyle}>
                {props.YesText ? props.YesText : "Yes"}
              </Text>
            </TouchableOpacity>
          </View>
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
    borderColor: theme.colors.warning,
    borderWidth: 3,
    borderRadius: 7,
    padding: 10,
  },

  alertTitleTextStyle: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: theme.colors.warning,
  },

  alertContentText: {
    textAlign: "left",
    fontSize: 16,
    marginBottom: 10,
    color: theme.colors.warning,
    paddingRight: 8,
  },

  alertCloseButtonStyle: {
    width: "40%",
    height: 50,
    backgroundColor: "white",
    borderColor: theme.colors.warning,
    borderWidth: 2,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },

  alertButtonTextStyle: {
    fontSize: 18,
    color: theme.colors.warning,
  },
});
