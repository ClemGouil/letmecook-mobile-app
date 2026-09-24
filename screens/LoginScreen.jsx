import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useUser } from '../hooks/useUser'
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Login() {

  const navigation = useNavigation();
  const route = useRoute();
  const resendVerification = route.params?.resendVerification;
  const emailFromRoute = route.params?.email;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [emailVerificationMode, setEmailVerificationMode] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const { login, resendVerificationEmail } = useUser();

  useEffect(() => {
    if (resendVerification) {
      setEmailVerificationMode(true);
      setShowResend(true);
    }
    if (emailFromRoute) {
      setEmail(emailFromRoute);
    }
  }, [resendVerification, emailFromRoute]);

  const handleSubmit = async () => {
    setError(''); 
    setSuccess('');

    if (isLoading) return;

    if ( !email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Format de l’email invalide.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(email, password);
    } catch (err) {
      console.error('Erreur login:', err);
      const status = err.response?.status;
      const error = err.response?.data?.error;

      if (status === 403 && error === 'EMAIL_NOT_VERIFIED') {
        setEmailVerificationMode(true); 
        setError(''); 
        setSuccess('');
        return;
      }
      if (status === 401 && error === 'INVALID_CREDENTIALS') {
        setError('Email ou mot de passe incorrect.');
        return;
      }
      if (status === 400) {
        setError('Veuillez renseigner votre email et votre mot de passe.');
        return;
      }
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendVerification = async () => {
    if (isResending) return;

    setError(''); 
    setSuccess('');

    if ( !email) {
      setError('Veuillez renseigner votre adresse email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Format de l’email invalide');
      return;
    }

    try {
      setIsResending(true);
      await resendVerificationEmail(email)
      setSuccess(
        'Si votre compte n’est pas encore vérifié, un nouvel email a été envoyé.'
      );
    } catch (err) {
      console.error('Erreur renvoi email:', err);
      setError("Impossible d'envoyer l'email. Veuillez réessayer.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => { 
    setEmailVerificationMode(false);
    setError(''); 
    setSuccess(''); 
    setPassword(''); 
  };

  if (emailVerificationMode) { 
    return ( 
      <View style={styles.screen}> 
        <View style={styles.container}> 
          {!showResend ? (
            <>
            <Text style={styles.title}> Vérifiez votre email </Text> 
            <Icon name="mail-outline" size={52} color="rgb(180, 180, 230)" style={styles.icon} /> 
            
            <Text style={styles.subtitle}> Un email de vérification vous a été envoyé. 
              {'\n\n'} 
              <Text style={{ fontWeight: '600' }}> Ouvrez votre boîte mail </Text> 
              {' '}et cliquez sur le lien de vérification pour activer votre compte. 
              {'\n\n'} Pensez également à vérifier vos courriers indésirables ou votre dossier spam. 
            </Text>
            </>
          ) : 
            <>
              <Text style={styles.title}> Renvoyer l'email </Text> 
              <Icon name="mail-outline" size={52} color="rgb(180, 180, 230)" style={styles.icon} /> 
              
              <Text style={styles.subtitle}> Si vous n'avez pas reçu l'email de vérification, 
              renseignez votre adresse email ci-dessous pour demander un nouvel envoi.
              </Text>
            </>
          } 

          {error ? ( 
            <Text style={styles.errorText}> {error} </Text> 
          ) : null}

          {success ? ( 
            <Text style={styles.successText}> {success} </Text> 
          ) : null} 

          
          
          {!showResend ? (
            <TouchableOpacity 
              onPress={() => { setShowResend(true); setError(''); setSuccess(''); }} 
            >
              <Text style={styles.resendLink}> Vous n'avez pas reçu l'email ? </Text>
            </TouchableOpacity>
          ) : (
            <>
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
                  setSuccess(''); 
                }} 
              /> 
              <TouchableOpacity 
                style={styles.button} 
                disabled={isResending} 
                onPress={handleResendVerification} 
              > 
                {isResending ? ( 
                  <ActivityIndicator color="#fff" /> 
                ) : ( 
                  <Text style={styles.buttonText}> Renvoyer l'email </Text> 
                )} 
              </TouchableOpacity> 
            </>
          )}

          <TouchableOpacity 
            onPress={handleBackToLogin} 
            disabled={isResending} 
          > 
            <Text style={styles.loginText}> c'est fait ? <Text style={styles.loginLink}>Retour à la connexion</Text></Text> 
          </TouchableOpacity> 
        
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Se connecter</Text>

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
            setSuccess('');
          }}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
              setSuccess('');
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

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} disabled={isLoading} onPress={handleSubmit}>
          {isLoading ? ( 
            <ActivityIndicator color="#fff" /> ) : ( 
              <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} > 
          <Text style={styles.forgotPasswordText}> Mot de passe oublié ? </Text> 
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>
            Vous n'avez pas de compte ? <Text style={styles.signUpLink}>Inscrivez-vous ici</Text>
          </Text>
        </TouchableOpacity>
        
        {/* A enlever */}
        <TouchableOpacity
          onPress={() => navigation.navigate('VerifyEmail', {
            token: 'trycHwPfL8kIfypbaUv4k9FsIV9xUQCO_rN2X7MVfxo',
            email: email,
          })}
        >
          <Text> Tester la vérification email</Text>
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
  icon: { 
    alignSelf: 'center', 
    marginBottom: 16, 
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
  passwordContainer: {
    position: "relative",
    width: "100%",
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
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 12,
    padding: 5,
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
  resendLink: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#3f51b5',
    fontWeight: '500',
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
  forgotPasswordText: { 
    textAlign: 'center', 
    marginTop: 10, 
    fontSize: 14, 
    color: '#3f51b5', 
    fontWeight: '500', 
  },
  signUpText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  signUpLink: {
    color: '#3f51b5',
    fontWeight: '500',
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