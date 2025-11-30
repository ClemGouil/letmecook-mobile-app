import React, { useMemo, useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

const SelectGroupForm = ({ groups ,onSave, onCancel }) => {

    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const radioButtons = useMemo(() => 
        groups.map(g => ({
        id: g.id.toString(),
        label: g.name,
        value: g.id,
        size: 22,
        color: '#3f51b5',
        labelStyle: { fontSize: 16, color: '#000', fontWeight: '500' }
        }))
    , [groups]);

  return (
    <View style={styles.formContainer}>

      <Text style={styles.title}>Choisir le groupe à qui partager</Text>

      <RadioGroup
        radioButtons={radioButtons}
        onPress={setSelectedGroupId}
        selectedId={selectedGroupId}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            !selectedGroupId && styles.disabledButton
          ]}
          disabled={!selectedGroupId}
          onPress={() => onSave(selectedGroupId)}
        >
          <Text style={styles.saveText}>Partager</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
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
  saveButton: {
    flex: 1,
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default SelectGroupForm;