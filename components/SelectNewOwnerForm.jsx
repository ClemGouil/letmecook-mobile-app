import React, { useMemo, useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import ModalButton from "./ModalButton";

const SelectNewOwnerForm = ({ members, group ,onSave, onCancel }) => {

    const [selectedNewOwnerId, setSelectedNewOwnerId] = useState(null);

    const radioButtons = useMemo(() => 
        members.map(m => ({
        id: m.user.id.toString(),
        label: m.user.username,
        value: m.user.id,
        size: 22,
        color: '#3f51b5',
        labelStyle: { fontSize: 16, color: '#000', fontWeight: '500' }
        }))
    , [members]);

  return (
    <View style={styles.formContainer}>

      <Text style={styles.title}>Choisir le nouveau propriétaire</Text>

      <RadioGroup
        radioButtons={radioButtons}
        onPress={setSelectedNewOwnerId}
        selectedId={selectedNewOwnerId}
      />

      <View style={styles.buttonRow}>
        <ModalButton
          title="Choisir"
          onPress={() => onSave(group, selectedNewOwnerId)}
          disabled={!selectedNewOwnerId}
        />

        <ModalButton
          title="Annuler"
          variant="secondary"
          onPress={onCancel}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default SelectNewOwnerForm;