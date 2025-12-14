import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useUser } from '../hooks/useUser'
import { useNavigation} from '@react-navigation/native';

export default function Register() {

  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { user, register } = useUser();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const newUser = await register(username, firstName, lastName, email, password);
      console.log('User registered:', newUser);
    } catch (err) {
      console.error('Register error:', err);
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <View style={styles.screen}>
        <View style={styles.container}>
        <Text style={styles.title}>S'enregistrer</Text>

        <TextInput
            placeholder="Nom d'utilisateur"
            style={styles.input}
            value={username} 
            onChangeText={setUsername}
        />

        <TextInput
            placeholder="Prénom"
            style={styles.input}
            value={firstName} 
            onChangeText={setFirstName}
        />

        <TextInput
            placeholder="Nom de famille"
            style={styles.input}
            value={lastName} 
            onChangeText={setLastName}
        />

        <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            value={email} 
            onChangeText={setEmail}
        />

        <TextInput
            placeholder="Mot de passe"
            secureTextEntry
            style={styles.input}
            value={password} 
            onChangeText={setPassword}
        />

        <TextInput
            placeholder="Confirmez le mot de passe"
            secureTextEntry
            style={styles.input}
            value={confirmPassword} 
            onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>S'enregistrer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpText}>
            Vous avez déjà un compte ? <Text style={styles.signUpLink}>Connectez-vous ici</Text>
            </Text>
        </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3f51b5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  signUpText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    color: '#000',
  },
  signUpLink: {
    color: '#3f51b5',
    fontWeight: '500',
  },
})