import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { theme } from "../core/theme";

export default function Button({ mode, title, style, ...props }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        mode === "outlined"
          ? {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.primaryBorder,
            }
          : {},
        ,
        { ...style },
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          mode === "outlined"
            ? { color: theme.colors.primary }
            : { color: "white" },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 20,
    height: 50,
    width: "100%",
    marginVertical: 10,
    // paddingVertical: 2,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  text: {
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});
