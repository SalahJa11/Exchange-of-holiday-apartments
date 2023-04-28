import React, { useState } from "react";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { emailValidator } from "../helpers/emailValidator";
import { passwordRecoveryEmail } from "../config/cloud";
import Processing from "../components/Processing";
import Note from "../components/Note";
import Error from "../components/Error";
import { View } from "react-native";

export default function ResetPasswordScreen({ navigation }) {
  const toCloseError = () => {
    typeof setErrorVisible === "function" ? setErrorVisible(false) : null;
    typeof setNoteVisible === "function" ? setNoteVisible(false) : null;
    typeof setWarningVisible === "function" ? setWarningVisible(false) : null;
  };
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("ErrorTitle");
  const [errorContent, setErrorContent] = useState("error");
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Note");
  const [noteContent, setNoteContent] = useState("Done");
  const [isProcessing, setIsProcessing] = useState(false);

  const [email, setEmail] = useState({ value: "", error: "" });

  async function sendResetPasswordEmail() {
    console.log("temp");
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    setIsProcessing(true);
    await passwordRecoveryEmail(email.value)
      .then(() => {
        setIsProcessing(false);
        setNoteTitle("Note");
        setNoteContent("Password reset email was sent");
        setNoteVisible(true);
      })
      .catch((error) => {
        setIsProcessing(false);
        setErrorTitle("Error");
        setErrorContent(error.message);
        setErrorVisible(true);
      });
  }
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      {/* <View> */}
      {/* <Header>Restore Password</Header> */}
      <TextInput
        style={{ zindex: 0 }}
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive email with password reset link."
      />
      <Button
        mode="contained"
        onPress={() => {
          sendResetPasswordEmail();
        }}
        style={{ marginTop: 16 }}
      >
        Send Instructions
      </Button>
      {/* </View> */}
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
          navigation.replace("StartScreen");
        }}
        secondKey={false}
      ></Note>
      <Processing visible={isProcessing} content={"Loading..."}></Processing>
    </Background>
  );
}
