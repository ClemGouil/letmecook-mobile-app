import React, { useState } from 'react';
import { Text, TextInput , View, ScrollView, TouchableOpacity, StyleSheet, Image, Switch} from 'react-native';
import { useUser } from '../hooks/useUser';
import { useImage } from '../hooks/useImage'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AccordionSection from '../components/AccordionSection'

export default function ProfileScreen() {

    const navigation = useNavigation();

    const { user, logout, updateUser } = useUser();
    const {  uploadImage } = useImage();

    const [editingProfile, setEditingProfile] = React.useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });

    const [editingPreferences, setEditingPreferences] = React.useState(false);
    const [editedPreferences, setEditedPreferences] = useState({ ...user.preferences });

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const groups = [
      {
        id: 'g1',
        name: 'Groupe 1',
        members: [{ user: { id: '1' }, role: 'admin', joinedAt: '2023-01-01' }],
      },
      {
        id: 'g2',
        name: 'Groupe 2',
        members: [{ user: { id: '1' }, role: 'member', joinedAt: '2023-02-15' }],
      },
    ];

    const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  const toggleEditProfile = () => {
    setEditingProfile(!editingProfile)
  }

  const toggleEditPreferences = () => {
    setEditingPreferences(!editingPreferences)
  }

  const toggleSwitch = () => {
    setEditedPreferences({ ...editedPreferences, notifications: !editedPreferences.notifications });
  };

  const pickImage = async () => {
    // Demande la permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Permission refusée pour accéder aux images.");
      return;
    }

    // Ouvre la galerie
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setEditedUser({
        ...editedUser,
        profilePhotoUrl: result.assets[0].uri,
      });
    }
  };

  const handleEditProfile = async () => {
    try {
      let finalImageUrl = editedUser.profilePhotoUrl;

      if (editedUser.profilePhotoUrl && editedUser.profilePhotoUrl.startsWith("file://")) {
        finalImageUrl = await uploadImage(editedUser.profilePhotoUrl);
      }
      
      setEditedUser({ ...editedUser, profilePhotoUrl: finalImageUrl })
      console.log(user.id)
      await updateUser(user.id, editedUser);

      setEditingProfile(!editingProfile)
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleEditPreferences = async () => {
    try {

      const updatedUser = { ...editedUser, preferences: editedPreferences };

      await updateUser(user.id, updatedUser);

      setEditedUser(updatedUser);
      setEditingPreferences(!editingPreferences)
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleSubmitPassword  = async () => {
    if (newPassword === confirmPassword) {
      pass
    } else {
     pass
    }
  }

  const handleShowDetailsGroup = () => {

  }

  const getUserRole = (group) =>  {
    if (!user.id) return 'Membre';
    const member = group.members.find((m) => m.user.id === user.id);
    return member ? member.role : 'Membre';
  }

  const getJoinedDate =(group) => {
    if (!user.id) return 'Date inconnue';
    const member = group.members.find((m) => m.user.id === user.id);
    return member ? member.joinedAt : 'Date inconnue';
  }

  if (!user) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Aucun utilisateur connecté</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Aller au Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
        <AccordionSection title="Mon Profil">

          <Image
            source={{ uri: editedUser.profilePhotoUrl || user.profilePhotoUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}} style={styles.avatar}
          />
          {editingProfile && (
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Text style={styles.addButtonText}>Changez l'image</Text>
          </TouchableOpacity>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom d'utilisateur :</Text>
            {editingProfile ? (
              <TextInput style={styles.input}
                value={editedUser.username}
                onChangeText={(text) => setEditedUser({ ...editedUser, username: text })}
                placeholder="nom d'utilisateur"
              />
            ) : (
              <Text style={styles.valueText}>{user.username}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Prénom :</Text>
            {editingProfile ? (
              <TextInput
                style={styles.input}
                value={editedUser.firstName}
                onChangeText={(text) => setEditedUser({ ...editedUser, firstName: text })}
                placeholder="prénom"
              />
            ) : (
              <Text style={styles.valueText}>{user.firstName}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom :</Text>
            {editingProfile ? (
              <TextInput
                style={styles.input}
                value={editedUser.lastName}
                onChangeText={(text) => setEditedUser({ ...editedUser, lastName: text })}
                placeholder="nom"
              />
            ) : (
              <Text style={styles.valueText}>{user.lastName}</Text>
            )}
          </View>

          {!editingProfile ? (
            <TouchableOpacity style={styles.button} onPress={() => toggleEditProfile()}>
              <Icon name='pencil-outline' size={20} color="rgb(180, 180, 230)" style={styles.iconStyle}/>
              <Text style={styles.buttonText}>Modifier</Text>
            </TouchableOpacity>
            ) : (
            <TouchableOpacity style={styles.button} onPress={() => handleEditProfile()}>
              <Icon name='save-outline' size={20} color="rgb(180, 180, 230)" style={styles.iconStyle}/>
              <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
            )}
        </AccordionSection>

        <AccordionSection title="Mes Préferences">

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Langue :</Text>
            {editingPreferences ? (
              <TextInput
                style={styles.input}
                value={editedPreferences.langue}
                onChangeText={(text) => setEditedPreferences({ ...editedPreferences, langue: text })}
                placeholder="langue"
              />
            ) : (
              <Text style={styles.valueText}>{user.preferences.langue || 'fr'}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notifications :</Text>
            {editingPreferences ? (
              <Switch
                trackColor={{ false: '#767577', true: 'rgb(180, 180, 230)' }}
                thumbColor={
                  editedPreferences.notifications ? 'rgb(40, 140, 240)' : '#f4f3f4'
                }
                onValueChange={toggleSwitch}
                value={editedPreferences.notifications}
              />
            ) : (
              <Text style={styles.valueText}>
                {user.preferences.notifications ? 'Oui' : 'Non'}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Allergies :</Text>
            {editingPreferences ? (
              <TextInput
                style={styles.input}
                value={editedPreferences.allergies}
                onChangeText={(text) =>
                  setEditedPreferences({ ...editedPreferences, allergies: text })
                }
                placeholder="allergies"
              />
            ) : (
              <Text style={styles.valueText}>
                {user.preferences.allergies || 'Aucune'}
              </Text>
            )}
          </View>

          {!editingPreferences ? (
            <TouchableOpacity style={styles.button} onPress={() => toggleEditPreferences()}>
              <Icon name='pencil-outline' size={20} color="rgb(180, 180, 230)" style={styles.iconStyle}/>
              <Text style={styles.buttonText}>Modifier</Text>
            </TouchableOpacity>
            ) : (
            <TouchableOpacity style={styles.button} onPress={() => handleEditPreferences()}>
              <Icon name='save-outline' size={20} color="rgb(180, 180, 230)" style={styles.iconStyle}/>
              <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
            )}

        </AccordionSection>

        <AccordionSection title="Mes groupes">
          {groups.length > 0 ? (
            <>
            <View style={styles.table}>
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>Nom</Text>
                <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>Rôle</Text>
                <Text style={[styles.cell, styles.headerCell]}>Adhésion</Text>
              </View>
              {groups.map((group) => (
                <View key={group.id} style={styles.row}>
                  <Text style={[styles.cell, styles.borderRight]}>{group.name}</Text>
                  <Text style={[styles.cell, styles.borderRight]}>{getUserRole(group)}</Text>
                  <Text style={styles.cell}>{getJoinedDate(group)}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {handleShowDetailsGroup}}
            >
              <Icon name="information-circle-outline" size={20} color="rgb(180, 180, 230)" />
              <Text style={styles.buttonText}>Voir Détails</Text>
            </TouchableOpacity>
            </>
        ) : (
          <Text>Vous ne faites partie d’aucun groupe.</Text>
        )}

        </AccordionSection>

        <AccordionSection title="Changer le mot de passe">

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe actuel :</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Mot de passe actuel"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nouveau mot de passe :</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nouveau mot de passe"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmer :</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmer le mot de passe"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {handleSubmitPassword}}
          >
            <Icon name="swap-horizontal-outline" size={20} color="rgb(180, 180, 230)" />
            <Text style={styles.buttonText}>Changer</Text>
          </TouchableOpacity>
          
        </AccordionSection>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: '100%',
    backgroundColor: '#fff',
    elevation: 2,
    borderBottomWidth: 0.3,
    borderColor: '#ddd',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },

  scrollContent: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  valueText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53935',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    alignSelf: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: 'rgb(180, 180, 230)',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  button : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginTop: 14,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  table: {
    minWidth: 300,
  },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgb(180, 180, 230)',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  headerRow: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#fbcfe8rgb(180, 180, 230)',
  },
  noGroupText: {
    padding: 10,
    fontStyle: 'italic',
  },
});