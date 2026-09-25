import React, { useState,useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../hooks/useUser'
import { useNavigation, useRoute } from '@react-navigation/native';

export default function VerifyEmailScreen() {

  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  
  const token = route.params?.token;
  const email = route.params?.email;

  const { verifyEmail } = useUser();

  useEffect(() => { 
    const verifyEmailFunction = 
      async () => { 
        if (!token) { 
          setError('Ce lien de vérification est invalide.'); 
          setIsLoading(false); 
          return; 
        } 
      try { 
        await verifyEmail(token); 
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000)
      } catch (err) { 
        console.error('Erreur vérification email:', err); 
        setError( "Ce lien de vérification est invalide ou a expiré." ); 
      } finally { 
        setIsLoading(false); 
      } 
    }; 
    verifyEmailFunction(); 
  }, [token]);

  return (
    <View style={styles.screen}> 
      <View style={styles.container}> 
      
        {isLoading ? ( 
          <> 
            <Text style={styles.title}> Vérification de votre adresse e-mail </Text> 

            <ActivityIndicator size="large" color="rgb(180, 180, 230)" /> 
              
            <Text style={styles.subtitle}> Nous vérifions votre adresse e-mail... </Text> 
          </> 
        ) : success ? ( 
          <>  
            <Text style={styles.title}> Adresse e-mail vérifiée ! </Text> 
            <Icon name="checkmark-circle-outline" size={60} color="rgb(100, 180, 120)" style={styles.icon} />

            <Text style={styles.subtitle}> Votre adresse e-mail a bien été vérifiée. Vous pouvez maintenant vous connecter. </Text> 
            
            <Text style={styles.redirectText}>
              Vous allez être redirigé vers la connexion...
            </Text>
          </> 
        ) : ( 
          <> 
            <Text style={styles.title}> Vérification de votre adresse e-mail impossible </Text> 
            <Icon name="close-circle-outline" size={60} color="red" style={styles.icon} /> 

            <Text style={styles.errorText}> {error} </Text> 

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.navigate('Login', {
                  resendVerification: true,
                  email,
                })
              } 
            > 
              <Text style={styles.buttonText}> Renvoyer l'e-mail </Text> 
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')} > 
              <Text style={styles.buttonText}> Retour à la connexion </Text> 
            </TouchableOpacity> 
          </> 
        )} 
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
  redirectText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
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
})