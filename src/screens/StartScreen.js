import React, { useEffect, useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import { theme } from "../core/theme";
import Paragraph from "../components/Paragraph";
import {
  Text,
  ActivityIndicator,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { getUserData } from "../config/cloud";
import Processing from "../components/Processing";

export default function StartScreen({ navigation }) {
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    setIsProcessing(true);
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsProcessing(true);
          const uid = user.uid;
          console.log("user signed in", uid);

          getUserData()
            .then((profile) => {
              console.log("profile = ", profile);
              if (profile == "") {
                console.log("sign out function required !");
                setIsProcessing(false);
              } else {
                navigation.replace("HomeScreen", {
                  paramKey: profile,
                });
              }
            })
            .catch((error) => {
              setIsProcessing(false);
            });

          setIsProcessing(false);
        } else {
          console.log("user not signed in !", user);
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setIsProcessing(false);
    }
  }, []);

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
