import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
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
import { ScrollView } from "react-native-gesture-handler";
import { logIn } from "../config/cloud";
import { auth } from "../config/firebase";
import Processing from "../components/Processing";
import Warning from "../components/Warning";
import Note from "../components/Note";
import { sendEmailVerification } from "firebase/auth";
import Error from "../components/Error";
import BackgroundForScroll from "../components/BackgroundForScroll";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("error");
  const [errorGoal, setErrorGoal] = useState("modal");
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Note");
  const [noteContent, setNoteContent] = useState("Done");
  const [warningVisible, setWarningVisible] = useState(false);
  const [warningTitle, setWarningTitle] = useState("Warning");
  const [warningContent, setWarningContent] = useState("Are you sure?");
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };
  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    setIsProcessing(true);
    await logIn(email.value, password.value)
      .then(async () => {
        const user = auth.currentUser;
        console.log("user = > ", user.emailVerified, user);
        if (user.emailVerified) navigation.replace("HomeScreen");
        else {
          await sendEmailVerification(auth.currentUser).then(() => {
            setNoteTitle("Note");
            setNoteContent(
              "Please check your email\n A verification email has been sent to your email"
            );
            setNoteVisible(true);
          });
        }
        setIsProcessing(false);
      })
      .catch((error) => {
        setErrorTitle("Error");
        setErrorContent(error.message);
        setIsProcessing(false);
        setErrorVisible(true);
      });
  };

  return (
    <BackgroundForScroll>
      <ScrollView
        style={styles.ScrollView1}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.View2}>
          <BackButton goBack={navigation.goBack} />

          <Logo />
          <Header>Welcome</Header>
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
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ResetPasswordScreen")}
            >
              <Text style={styles.forgot}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
          <Button mode="contained" onPress={onLoginPressed} title="Login" />
          <View style={styles.row}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.replace("RegisterScreen")}
            >
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Error
        visible={errorVisible}
        title={errorTitle}
        content={errorContent}
        onPress={() => {
          toCloseError();
        }}
      />
      <Note
        visible={noteVisible}
        title={noteTitle}
        content={noteContent}
        onPress={() => {
          toCloseError();
        }}
        secondKey={false}
      ></Note>
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
    </BackgroundForScroll>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.primary,
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
});
