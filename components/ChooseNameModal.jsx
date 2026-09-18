import React, { useState, useEffect, useRef  } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from "react-native";

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
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                !name.trim() && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!name.trim()}
            >
              <Text
                style={[
                  styles.submitText,
                  !name.trim() && styles.disabledText,
                ]}
              >
                Valider
              </Text>
            </TouchableOpacity>
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
  button: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "rgb(180, 180, 230)",
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgb(180, 180, 230)",
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize : 16
  },
  cancelText: {
    color: "#555555",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledText: {
    color: '#888',
  },
});

export default ChooseNameModal;