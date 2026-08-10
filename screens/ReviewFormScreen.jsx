import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../hooks/useUser';
import { useReview } from '../hooks/useReview';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarRating from 'react-native-star-rating-widget';

import BackButton from '../components/BackButton';
import SaveButton from '../components/SaveButton';

export default function ReviewFormScreen({ route, navigation }) {

  const data = route.params || {};

  const { user } = useUser();
  const { createReview, updateReview } = useReview();

  const [rating, setRating] = React.useState(data.reviewToEdit ? data.reviewToEdit.rating : null);
  const [content, setContent] = useState(data.reviewToEdit ? data.reviewToEdit.content : '');

  const handleCancel = () => {
    navigation.goBack();
  };

  const  handleValidate = async () => {
    try {
      if (data.reviewToEdit) {
        await updateReview(
          data.reviewToEdit.id,
          {
            rating,
            content
          }
        );
      } else {
        await createReview({
            userId: user.id,
            recipeId: data.recipeId,
            rating: rating,
            content: content
        });
      } 
        
      navigation.goBack();
    } catch (err) {
      console.error('Erreur lors de l ajout ou maj de l avis :', err);
    }
  };

  return (

  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
      <View style={styles.cardContainer}>
          <View style={styles.headerButtons}>
              <BackButton onPress={handleCancel}/>
              <Text style={styles.titlePage}>
                {data.reviewToEdit
                  ? "Modifier son avis"
                  : "Donner son avis"
                }
              </Text>
              <SaveButton onPress={() => handleValidate()} title = "Valider" disabled={rating == null} />
          </View>
          <Text style={styles.subtitle}>Votre note :</Text>
          <StarRating
            rating={rating ?? 0}
            onChange={(value) => setRating(value)}
            starSize={35}
          />
          <Text style={styles.subtitle}>Un commentaire ?</Text>
          <TextInput
            style={styles.input}
            multiline
            value={content}
            onChangeText={setContent}
          />
        </View>
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  cardContainer: {
    backgroundColor: '#fff', 
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  titlePage: {
    flex: 1,
    textAlign: 'start',
    paddingLeft : 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerButtons: {
    paddingVertical : 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginVertical : 6
  },
  input: {
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 8,
    padding: 8,
  },
});