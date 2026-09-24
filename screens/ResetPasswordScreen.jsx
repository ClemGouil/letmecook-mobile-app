import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../hooks/useUser'
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ResetPasswordScreen() {

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  
  const token = route.params?.token;

  const { resetPassword } = useUser();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (isLoading) return;

    if (!token) { 
      setError('Lien de réinitialisation invalide.'); return; 
    }

    if ( !newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {

      setIsLoading(true);
      setError('');
      await resetPassword(token, newPassword);

      setSuccess('Votre mot de passe a été réinitialisé avec succès.');
      //navigation.navigate('Login');

    } catch (err) {
      console.error('Reset Password error:', err);
      setError( "Une erreur est survenue. Veuillez réessayer." );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Réinitialisation de mot de passe </Text>

        <Text style={styles.subtitle}> Choisissez un nouveau mot de passe pour votre compte. </Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
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

        {success ? ( <Text style={styles.successText}> {success} </Text> ) : null}
        
        <TouchableOpacity style={styles.button} disabled={isLoading} onPress={handleSubmit}>
          {isLoading ? ( 
            <ActivityIndicator color="#fff" /> ) : ( 
              <Text style={styles.buttonText}> Changer </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} > 
          <Text style={styles.loginText}> Annuler ? <Text style={styles.loginLink}>Retour à la connexion</Text></Text> 
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
  subtitle: { 
    textAlign: 'center', 
    color: '#666', 
    lineHeight: 20, 
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
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: { 
    color: 'green', 
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
  loginText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  loginLink: {
    color: '#3f51b5',
    fontWeight: '500',
  },
})