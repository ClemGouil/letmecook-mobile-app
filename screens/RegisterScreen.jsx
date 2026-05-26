import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useUser } from '../hooks/useUser'
import { useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Register() {

  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, register } = useUser();

  const handleSubmit = async () => {
    setError('');

    if (isLoading) return;

    if ( !username || !firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Format de l’email invalide');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await register(username, firstName, lastName, email, password);
    } catch (err) {
      console.error('Register error:', err);
      setError("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
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
            onChangeText={(text) => {
              setUsername(text);
              setError('');
            }}
        />

        <TextInput
            placeholder="Prénom"
            style={styles.input}
            value={firstName} 
            onChangeText={(text) => {
              setFirstName(text);
              setError('');
            }}
        />

        <TextInput
            placeholder="Nom de famille"
            style={styles.input}
            value={lastName} 
            onChangeText={(text) => {
              setLastName(text);
              setError('');
            }}
        />

        <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            value={email} 
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry = {!showPassword}
            style={styles.input}
            value={password} 
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
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
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirmez le mot de passe"
            secureTextEntry = {!showConfirmPassword}
            style={styles.input}
            value={confirmPassword} 
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError('');
            }}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(prev => !prev)}
            style={styles.eyeButton}
          >
            <Icon
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="rgb(180, 180, 230)"
            />
          </TouchableOpacity>
        </View>
        

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} disabled={isLoading} onPress={handleSubmit}>
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