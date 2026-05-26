import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useUser } from '../hooks/useUser'
import { useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Login() {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { user, login } = useUser();

  const handleSubmit = async () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Format de l’email invalide');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setError('');
      const loggedUser = await login(email, password);
    } catch (err) {
      console.error('Erreur login:', err);
      setError('Email ou mot de passe incorrect');
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Se connecter</Text>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
            style={styles.eyeButton}
          >
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="rgb(180, 180, 230)"
            />
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>
            Vous n'avez pas de compte ? <Text style={styles.signUpLink}>Inscrivez-vous ici</Text>
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
    backgroundColor: 'rgb(157, 157, 225)',
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
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 12,
    padding: 5,
  },
})