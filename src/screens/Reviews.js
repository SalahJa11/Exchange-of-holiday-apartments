import { View, Text } from "react-native";
import ReviewsBox from "../components/ReviewsBox";
import Background from "../components/Background";
export default function Reviews({ navigation, route }) {
  return (
    <Background>
      <ReviewsBox
        array={route.params?.array}
        navigation={navigation}
        extended={true}
        // toClose={() => {
        // }}
      />
      {/* <Text style={{ borderWidth: 3 }}>{JSON.stringify(route)}</Text> */}
    </Background>
  );
}
