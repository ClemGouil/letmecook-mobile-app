import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const AppButton = ({ title, onPress, variant = "primary", disabled = false, style }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "primary" && styles.primaryButton,
        variant === "secondary" && styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" && styles.primaryText,
          variant === "secondary" && styles.secondaryText,
          disabled && styles.disabledText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  primaryButton: {
    backgroundColor: "rgb(180, 180, 230)",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgb(180, 180, 230)",
  },
  text: {
    fontSize: 16,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  secondaryText: {
    color: "#555555",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  disabledText: {
    color: "#888",
  },
});

export default AppButton;