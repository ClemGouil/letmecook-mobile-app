import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useUser } from '../hooks/useUser'
import { useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ForgotPasswordScreen() {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { forgotPassword } = useUser();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (isLoading) return;

    if (!email) {
      setError('Veuillez renseigner votre adresse e-mail.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Format de l’email invalide');
      return;
    }

    try {

      setIsLoading(true);
      setError('');
      await forgotPassword(email);

      setSuccess( "Si cette adresse e-mail correspond à un compte, un lien de réinitialisation vous a été envoyé." );

    } catch (err) {
      console.error('Forgot Password error:', err); 
      setError( "Une erreur est survenue. Veuillez réessayer." );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.screen}>
      {success ? (
        <View style={styles.container}>
          <Text style={styles.title}>
            Vérifiez votre boîte mail
          </Text>

          <Icon name="checkmark-circle-outline" size={60} color="rgb(100, 180, 120)" style={styles.icon} />

          <Text style={styles.subtitle}>
            {success}
          </Text>

          <Text style={styles.redirectText}>
            Consultez votre boîte de réception et cliquez sur le lien
            pour choisir un nouveau mot de passe.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>
              Retour à la connexion
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Mot de passe oublié </Text>

          <Text style={styles.subtitle}> Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe. </Text>

          <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              value={email} 
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
            />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} disabled={isLoading} onPress={handleSubmit}>
            {isLoading ? ( 
              <ActivityIndicator color="#fff" /> ) : ( 
                <Text style={styles.buttonText}>Envoyer le lien</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} > 
            <Text style={styles.loginText}> Annuler ? <Text style={styles.loginLink}>Retour à la connexion</Text></Text> 
          </TouchableOpacity>

          {/* A enlever */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword', {
              token: '1WXjxNgLnnXGRKIjXXsjkBGPm7lI_Y2jVTpX7MR7FlE',
            })}
          >
            <Text> Tester Oublie de mdp</Text>
          </TouchableOpacity>

        </View>
      )}
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
  redirectText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  icon: { 
    alignSelf: 'center', 
    marginBottom: 16, 
  },
})