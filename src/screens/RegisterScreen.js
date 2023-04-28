import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Modal, Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { phoneNumberValidator } from "../helpers/phoneNumberValidator";
import { idValidator } from "../helpers/idValidator";
import { createNewUser, getUserData } from "../config/cloud";
import Processing from "../components/Processing";
import BackgroundForScroll from "../components/BackgroundForScroll";

export default function RegisterScreen({ navigation }) {
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const [alertTitle, setAlertTitle] = useState("Error");
  const [alertContent, setAlertContent] = useState("An error occurred");
  const [isAleretVisible, setIsAlertVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });
  const [id, setId] = useState({ value: "", error: "" });

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const phoneNumberError = phoneNumberValidator(phoneNumber.value);
    const idError = idValidator(id.value);

    if (
      emailError ||
      passwordError ||
      nameError ||
      phoneNumberError ||
      idError
    ) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setPhoneNumber({ ...phoneNumber, error: phoneNumberError });
      setId({ ...id, error: idError });
      return;
    }
    // console.log("in register", email, password, name, id, phoneNumber);
    setIsProcessing(true);
    await createNewUser(
      email.value,
      password.value,
      name.value,
      id.value,
      phoneNumber.value
    )
      .then((id) => {
        getUserData(id).then(async (profile) => {
          setIsProcessing(false);
          console.log("profile = ", profile);
          if (profile == "") {
            console.log("sign out function required !");
          } else {
            await sendEmailVerification(auth.currentUser).then(() => {
              setNoteTitle("Note");
              setNoteContent(
                "Please check your email\n A verification email has been sent to your email"
              );
              setNoteVisible(true);
            });
          }
        });
      })
      .catch((error) => {
        setIsProcessing(false);
        setAlertContent(error.message);
        setIsAlertVisible(true);
      });
  };
  return (
    <BackgroundForScroll>
      {/* <BackButton goBack={navigation.goBack} /> */}
      {/* <KeyboardAvoidingView
        behavior={Platform.OS ? "padding" : ""}
        style={{ width: "100%" }}
      > */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.ScrollView1}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.View2}>
          <Logo />
          <Header>Create Account</Header>
          <TextInput
            label="Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            error={!!name.error}
            errorText={name.error}
          />
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            returnKeyType="next"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <TextInput
            label="ID"
            returnKeyType="next"
            value={id.value}
            onChangeText={(text) => setId({ value: text, error: "" })}
            error={!!id.error}
            errorText={id.error}
            keyboardType="numeric"
          />
          <TextInput
            label="Phone Number"
            returnKeyType="done"
            value={phoneNumber.value}
            onChangeText={(text) => setPhoneNumber({ value: text, error: "" })}
            error={!!phoneNumber.error}
            errorText={phoneNumber.error}
            keyboardType="phone-pad"
          />

          <Button
            mode="contained"
            onPress={onSignUpPressed}
            style={{ marginTop: 24 }}
            title={"Sign Up"}
          />

          <View style={styles.row}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}
      <Modal visible={isAleretVisible}>
        <View style={styles.alertContainer}>
          <View style={styles.alertContentContainer}>
            <Text style={styles.alertTitleTextStyle}>{alertTitle}</Text>

            <Text style={styles.alertContentText}>{alertContent}</Text>

            <TouchableOpacity
              style={styles.alertCloseButtonStyle}
              onPress={() => {
                setIsAlertVisible(false);
              }}
            >
              <Text style={styles.alertButtonTextStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Processing visible={isProcessing} content={"Updating..."}></Processing>
    </BackgroundForScroll>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
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
    textAlign: "left",
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
