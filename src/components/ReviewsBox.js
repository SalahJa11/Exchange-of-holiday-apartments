import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Text,
} from "react-native";
import Processing from "../components/Processing";

import { Images, theme } from "../core/theme";
import { useState } from "react";
import { getApartmentOwner } from "../config/cloud";
import { Rating } from "react-native-ratings";

export default function ReviewsBox({ array, navigation, toClose, extended }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comment, setComment] = useState({
    image: Images.profile,
    comment: "temp",
  });
  try {
    if (!Array.isArray(array)) {
      return <></>;
    }
    if (array.length === 0) {
      return <></>;
    }
    let finalResult = [];
    for (const [index, rate] of array.entries()) {
      let chunk = (
        <TouchableOpacity
          onPress={() => {
            // typeof toClose === "function" ? toClose() : undefined;

            setComment(rate);
            setModalVisible(true);
          }}
          key={index}
          style={{
            width: "100%",
            height: 85,
            flexDirection: "row",
            padding: 10,
            marginBottom: 2,
            borderWidth: 2,
            borderColor: theme.colors.primaryBorder,
            // justifyContent: "center",
          }}
        >
          <View style={{ width: "17%" }}>
            <View
              style={{
                width: 50,
                height: 50,
              }}
            >
              <Image
                style={{
                  borderColor: theme.colors.primaryBorder,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                }}
                source={
                  rate.image == ""
                    ? require("../assets/profile.png")
                    : { uri: rate.image }
                }
                resizeMode="contain"
              />
            </View>
          </View>
          <View
            style={{
              maxHeight: 80,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              width: "83%",
            }}
          >
            <View>
              <Rating
                readonly={true}
                startingValue={rate.rate}
                imageSize={15}
              />
            </View>
            <Text
              style={{
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 15,
              }}
            >
              {rate.comment.length > 100
                ? rate.comment.slice(0, 100) + "..."
                : rate.comment}
            </Text>
          </View>
        </TouchableOpacity>
      );
      finalResult.push(chunk);
    }
    const Title = (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            fontWeight: "bold",
            textAlignVertical: "center",
          }}
        >
          Reviews
        </Text>
        <TouchableOpacity
          onPress={() => {
            typeof toClose === "function" ? toClose() : undefined;
            navigation.navigate("Reviews", { array: array });
          }}
        >
          <Image
            source={require("../assets/link.png")}
            style={{ marginLeft: 10, width: 25, height: 25 }}
          />
        </TouchableOpacity>
      </View>
    );
    const modalView = () => {
      return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          //   style={{ backgroundColor: theme.colors.surface }}
        >
          <View
            style={{
              margin: 20,
              justifyContent: "space-between",
              // alignItems: "center",
              // height: "100%",
              padding: 20,
              backgroundColor: theme.colors.surface,
              borderRadius: 20,
              shadowColor: "#000",
              elevation: 10,
            }}
          >
            <View
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.ProfileScreen}
            >
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.headerContent}
                  onPress={async () => {
                    setModalVisible(false);
                    setIsProcessing(true);
                    await getApartmentOwner(comment.id).then((temp) => {
                      setIsProcessing(false);
                      typeof toClose === "function" ? toClose() : undefined;
                      navigation.push("OwnerDetails", {
                        paramKey: { ...temp, id: comment.id },
                      });
                    });
                  }}
                >
                  <Image
                    style={styles.avatar}
                    source={
                      comment.image == ""
                        ? require("../assets/profile.png")
                        : { uri: comment.image }
                    }
                  />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={{ width: "100%" }}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={{
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontSize: 17,
                    backgroundColor: theme.colors.surface,
                    marginVertical: 8,
                  }}
                >
                  {comment.comment}
                </Text>
              </ScrollView>

              {/* </View> */}
              <TouchableOpacity
                style={[
                  styles.profilePressableButtons,
                  styles.profilePressableButtons2,
                ]}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    };
    return (
      <>
        {!extended && Title}
        <ScrollView
          nestedScrollEnabled={true}
          style={{ maxHeight: extended ? "100%" : 200, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {finalResult}
        </ScrollView>
        {modalView()}
        <Processing visible={isProcessing} content={"Loading..."}></Processing>
      </>
    );
  } catch (error) {
    console.error(error.message);
  }
}
const styles = StyleSheet.create({
  profileIconContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    width: 70,
    height: 70,
    zIndex: 1,
  },
  profileIcon: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 35,
    width: 70,
    height: 70,
    backgroundColor: theme.colors.surface,
  },
  HeddinScreeen: {
    flex: 1,
    // backgroundColor: "black",
  },
  ProfileScreen: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    // backgroundColor: "black",
    // margin: 40,
    // padding: 10,
    borderRadius: 20,
  },
  header: {
    backgroundColor: theme.colors.primary,
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
  profilePressableButtons: {
    // borderWidth: 2,
    // display: "flex",
    margin: 5,
    height: 45,
    borderRadius: 5,
    backgroundColor: "#fd0000",
    justifyContent: "center",
  },
  profilePressableButtons2: {
    backgroundColor: theme.colors.primary,
  },
});
