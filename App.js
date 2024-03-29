import React, { useState } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FlashMessage from "react-native-flash-message";
import { auth } from "./src/config/firebase";
import { theme } from "./src/core/theme";
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  HomeScreen,
  AvailableApartments,
  MyBookings,
  AddMyApartment,
  Chat,
  AddMyApartmentForm,
  EditApartment,
  ApartmentInfo,
  ProfileUpdate,
  OwnerDetails,
  Chating,
  Rating,
  SearchUsersAndApartments,
} from "./src/screens";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(auth.currentUser);
  onAuthStateChanged(auth, async (user) => {
    if (user && user.emailVerified) {
      console.log("user = > ", user);
      setUser(user);
    } else {
      setUser(null);
    }
  });
  const afterStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerTintColor: "white",
          headerPressColor: "#fffbe4",
          headerShown: true,

          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen
          name="AvailableApartments"
          options={{ title: "Map" }}
          component={AvailableApartments}
        />
        <Stack.Screen
          name="MyBookings"
          options={{ title: "My bookings " }}
          component={MyBookings}
        />
        <Stack.Screen
          name="AddMyApartment"
          options={{ title: "My apartments " }}
          component={AddMyApartment}
        />

        <Stack.Screen
          name="AddMyApartmentForm"
          options={{ title: "Adding new apartment/house" }}
          component={AddMyApartmentForm}
        />
        <Stack.Screen
          name="EditApartment"
          options={{ title: "Editing" }}
          component={EditApartment}
        />
        <Stack.Screen
          name="ApartmentInfo"
          options={{ title: "Details" }}
          component={ApartmentInfo}
        />
        <Stack.Screen
          name="ProfileUpdate"
          options={{ title: "Profile update" }}
          component={ProfileUpdate}
        />
        <Stack.Screen
          name="OwnerDetails"
          options={{ title: "Details" }}
          component={OwnerDetails}
        />
        <Stack.Screen name="Chating" component={Chating} />
        <Stack.Screen
          name="SearchUsersAndApartments"
          component={SearchUsersAndApartments}
        />
        <Stack.Screen name="Rating" component={Rating} />
      </Stack.Navigator>
    );
  };
  const authStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="StartScreen"
        screenOptions={{
          headerTintColor: "white",
          headerPressColor: "#fffbe4",
          headerShown: true,

          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
        }}
      >
        <Stack.Screen
          name="StartScreen"
          options={{ headerShown: false }}
          component={StartScreen}
        />
        <Stack.Screen
          name="LoginScreen"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="RegisterScreen"
          options={{ title: "Registration" }}
          component={RegisterScreen}
        />
        <Stack.Screen
          name="ResetPasswordScreen"
          options={{ title: "Password Reset" }}
          component={ResetPasswordScreen}
        />
      </Stack.Navigator>
    );
  };
  const applicationStack = user ? afterStack() : authStack();

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        {applicationStack}
        <FlashMessage position="bottom" floating={true} />
      </NavigationContainer>
    </Provider>
  );
}
