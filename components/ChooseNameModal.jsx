import React, { useState, useEffect, useRef  } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import ModalButton from "./ModalButton";

const ChooseNameModal = ({ visible, title, initialValue = '', placeholder, onSubmit, onCancel }) => {

  const [name, setName] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    setName(initialValue);
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [initialValue, visible]);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    onSubmit(trimmedName);
  };

  const handleCancel = () => {
    setName(initialValue);
    onCancel?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={name}
            placeholder={placeholder}
            onChangeText={setName}
          />

          <View style={styles.buttonRow}>
            <ModalButton
              title="Annuler"
              variant="secondary"
              onPress={handleCancel}
            />

            <ModalButton
              title="Valider"
              variant="primary"
              onPress={handleSubmit}
              disabled={!name.trim()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  container: {
    width: "90%",
    maxWidth: 500,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgb(180, 180, 230)",
  },
  title: {
    marginBottom: 12,
    color: "#333333",
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "rgb(180, 180, 230)",
    borderRadius: 10,
    backgroundColor: "#FAFAFF",
    color: "#222222",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
});

export default ChooseNameModal;