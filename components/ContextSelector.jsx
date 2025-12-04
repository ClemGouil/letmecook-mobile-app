import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomSelect from '../components/CustomSelect';
import { useAppContext } from '../hooks/useAppContext';
import { useUser } from '../hooks/useUser';
import { useGroup } from '../hooks/useGroup';

const ContextSelector = ({ showUserOption = true }) => {

  const { currentContext, setContext } = useAppContext();

  const { user } = useUser();
  
  const { groups } = useGroup();

  const [selectedId, setSelectedId] = useState(user.id);

  useEffect(() => {
    if (currentContext) {
      setSelectedId(currentContext.id);
    } else {
      const defaultContext = {
        id: user.id,
        type: 'user',
        name: user.username
      };
      setContext(defaultContext);
    }
  }, [currentContext]);

  const onChange = (value) => {
    setSelectedId(value);

    const isUser = value === user.id;
    const group = groups.find(g => g.id === value);

    setContext({
      id: value,
      type: isUser ? 'user' : 'group',
      name: isUser ? 'Moi' : (group?.name ?? 'Groupe inconnu')
    });
  };

  return (
    <View style={styles.pickerContainer}>
      <CustomSelect
        label="Choisir le contexte"
        options={[
          { label: 'Moi', value: user.id },
          ...groups.map(g => ({ label: g.name, value: g.id }))
        ]}
        selectedValue={selectedId}
        onValueChange={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 8
  },
  picker: {
  }
});

export default ContextSelector;