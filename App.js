/* eslint-disable prettier/prettier */
import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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
} from "./src/screens";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen
            name="AvailableApartments"
            component={AvailableApartments}
          />
          <Stack.Screen name="MyBookings" component={MyBookings} />
          <Stack.Screen name="AddMyApartment" component={AddMyApartment} />

          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
          <Stack.Screen
            name="AddMyApartmentForm"
            component={AddMyApartmentForm}
          />
          <Stack.Screen name="EditApartment" component={EditApartment} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
