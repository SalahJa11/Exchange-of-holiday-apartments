import React, { useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import {
  StyleSheet,
  Text,
  Modal,
  Image,
  Pressable,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BackButton from "../components/BackButton";
import Button from "../components/Button";

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      {/* hidden screen when you click in profile icon */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ScrollView
          style={styles.ScrollView1}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View style={styles.HeddinScreeen}>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.ProfileScreen}
            >
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Image
                    style={styles.avatar}
                    source={require("../assets/avatar.png")}
                  />

                  <Text style={styles.name}> add name here </Text>
                </View>
              </View>
              <View style={styles.DetailsContainer}>
                <Text style={styles.ProfileDetails}> ת.ז: </Text>
                <Text style={styles.ProfileDetails}> דואר אלקטרוני: </Text>
                <Text style={styles.ProfileDetails}> תאריך לידה: </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </Modal>
      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={require("../assets/profile.png")}
          style={styles.profileIcon}
        />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {/* <SafeAreaView style={styles.LogoTextContainer}>
          <Logo />
        </SafeAreaView> */}
        {/* all the button  */}
        <Logo />
        <Button
          mode="contained"
          onPress={() => navigation.navigate("AvailableApartments")}
        >
          Show Available Apartments
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("MyBookings")}
        >
          Show My Bookings
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("AddMyApartment")}
        >
          Add My Apartment
        </Button>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  profileIconContainer: {
    position: "absolute",
    top: 60,
    right: 4,
    width: 50,
    height: 50,
  },
  profileIcon: {
    width: 50,
    height: 50,
  },
  HeddinScreeen: {
    flex: 1,
    backgroundColor: "#000000aa",
  },
  ProfileScreen: {
    flex: 1,
    backgroundColor: "#ffffff",
    margin: 40,
    padding: 10,
    borderRadius: 10,
  },
  header: {
    backgroundColor: "#1c6669",
    borderRadius: 10,
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  DetailsContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  ProfileDetails: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 16,
    borderRadius: 100,
    width: "100%",
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#1c6669",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 200,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  Text: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  LogoTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  ScrollView1: {
    height: "100%",
    width: "100%",
  },
});
