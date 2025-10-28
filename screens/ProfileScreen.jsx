import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { useUser } from '../hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen() {

    const navigation = useNavigation();

    const { user, logout } = useUser();

    const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Info Section */}
      <View style={styles.container}>
        <Image
          source={{ uri: user.profilePhotoUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.username || 'Nom non spécifié'}</Text>
        <Text style={styles.email}>{user.email || 'Email non spécifié'}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
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
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 40,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});