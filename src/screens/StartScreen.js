import React, { useState } from "react";
import Background from "../components/Background";
import Button from "../components/Button";
import {
  Text,
  ActivityIndicator,
  View,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import Processing from "../components/Processing";
import Error from "../components/Error";
export default function StartScreen({ navigation }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("error");
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };

  return (
    <Background>
      {/* <View style={styles.View0}> */}
      <ScrollView
        style={styles.ScrollView1}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.View2}>
          <Image
            style={{ width: 300, height: 300, marginVertical: 10 }}
            source={require("../assets/logoWtext.png")}
          />
          <Button
            mode="contained"
            onPress={() => navigation.navigate("LoginScreen")}
            title="Login"
          />
          <Button
            style={{ width: "100%" }}
            mode="outlined"
            onPress={() => navigation.navigate("RegisterScreen")}
            title="Sign Up"
          />
        </View>
      </ScrollView>

      {/* </View> */}
      <Error
        visible={errorVisible}
        title={errorTitle}
        content={errorContent}
        onPress={() => {
          toCloseError();
        }}
      />
      <Processing visible={isProcessing} content={"Signing in..."}></Processing>
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
    // flex: 1,
    width: "100%",
    // borderWidth: 5,
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
  // hehehehehehe
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
  alertContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  alertContentContainer: {
    width: "70%",
    backgroundColor: "white",
    borderColor: "#ff3333",
    borderWidth: 3,
    borderRadius: 7,
    padding: 10,
  },

  alertTitleTextStyle: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#ff3333",
  },

  alertContentText: {
    textAlign: "right",
    fontSize: 16,
    marginBottom: 10,
    color: "#ff3333",
    paddingRight: 8,
  },

  alertCloseButtonStyle: {
    width: "70%",
    height: 50,
    backgroundColor: "white",
    borderColor: "#ff3333",
    borderWidth: 2,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },

  alertButtonTextStyle: {
    fontSize: 18,
    color: "#ff3333",
  },
});
