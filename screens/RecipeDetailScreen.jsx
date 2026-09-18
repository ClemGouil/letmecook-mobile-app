import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useUser } from '../hooks/useUser'
import { useRecipe } from '../hooks/useRecipe'
import { useGroup } from '../hooks/useGroup';
import { useReview } from '../hooks/useReview';
import { useDate } from '../hooks/useDate';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectGroupForm from '../components/SelectGroupForm';
import ReusableModal from '../components/ReusableModal';
import BackButton from '../components/BackButton';
import ReviewCard from '../components/ReviewCard';
import Chipset from '../components/Chipset';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function RecipeDetailScreen({ route }) {

  const navigation = useNavigation();
  const { user, getUserInfo } = useUser();
  const { groups} = useGroup();
  const { getReviewStatsFromRecipe, getReviewsFromRecipe, deleteReview} = useReview();
  const { getDayPeriodFromToday } = useDate();

  const { getRecipeById, addRecipe, addIngredientToRecipe, addInstructionToRecipe, deleteRecipe ,shareRecipeWithGroup, unshareRecipeFromGroup} = useRecipe();

  const isGroupRecipe = route.params.isGroupRecipe;
  const isOwner = route.params.isOwner;
  const isPublic = route.params.isPublic;
  const groupId = route.params.groupId;

  const [recipe, setRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [servings, setServings] = useState(0);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState(null);

  const [reviewStats, setReviewStats] = useState(null);
  const [myReview, setMyReview] = useState(null);

  const DefaultNbOfReview = 3;

  const loadReviewPage = React.useCallback(
    async (offset, limit) => {
      if (!isPublic || !recipe?.id) {
        return [];
      }

      const result = await getReviewsFromRecipe(
        recipe.id,
        user?.id,
        limit,
        offset
      );

      setMyReview(result.myReview);

      return result.reviews;
    },
    [
      recipe?.id,
      user?.id,
      isPublic,
      getReviewsFromRecipe,
    ]
  );

  const { 
    items: reviews, loading: loadingReviews, loadingMore: loadingMoreReviews, hasMore: hasMoreReviews, loadInitial: loadReviews, loadMore: loadMoreReviews, refresh: refreshReviews 
  } = usePaginatedList({
    loadPage: loadReviewPage,
    pageSize: DefaultNbOfReview,
  });
  
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const loadRecipe = async () => {
        try {
          setLoadingRecipe(true);
          const data = await getRecipeById(route.params.recipeId);
          if (!isMounted) return;
          setRecipe(data);
          setServings(data?.servings ?? 0);

        } catch (err) {
          if (!isMounted) return;
          console.error(
            "Erreur lors du chargement de la recette :",
            err
          );
          setRecipe(null);
        } finally {
          if (isMounted) {
            setLoadingRecipe(false);
          }
        }
      };
      loadRecipe();
      return () => {isMounted = false;};
    }, [route.params.recipeId, getRecipeById])
  );

  useEffect(() => {
    if (!recipe?.id || !isPublic) {
      return;
    }

    const loadPublicData = async () => {
      try {
        if (recipe.ownerId) {
          const info = await getUserInfo(recipe.ownerId);
          setOwnerInfo(info);
        }
        const stats = await getReviewStatsFromRecipe(recipe.id);
        setReviewStats(stats);

        await loadReviews();

      } catch (err) {
        console.error(
          "Erreur lors du chargement des données publiques :",
          err
        );
      }
    };

    loadPublicData();
  }, [
    recipe?.id,
    isPublic,
    loadReviews,
    getUserInfo,
    getReviewStatsFromRecipe,
  ]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isPublic || !recipe?.id) {return;}
      refreshReviews();
      getReviewStatsFromRecipe(recipe.id)
        .then(stats => setReviewStats(stats))
        .catch(err => console.error(err));

    }, [
      recipe?.id,
      isPublic,
      refreshReviews,
      getReviewStatsFromRecipe,
    ])
  );

  const getScaledQuantity = (originalQuantity) => {
    const ratio = servings / recipe.servings;
    return Math.round(originalQuantity * ratio * 100) / 100;
  };

  const getTotalTime = () => {
    const total = Number(recipe.prepTime) + Number(recipe.cookTime);
    const hours = Math.floor(total / 60);
    const minutes = total % 60;

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
    if (hours > 0) return `${hours} h`;
    return `${minutes} min`;
  };

  const increaseServings = () => {
    setServings(prev => prev + 1);
  };

  const decreaseServings = () => {
    if (servings > 1) {
      setServings(prev => prev - 1);
    }
  };

  const handleEdit = (recipeId) => {
    navigation.navigate('RecipeForm', { recipeId : recipeId });
  };

  const handleShare = async (recipeId, groupId) => {
    try {
      await shareRecipeWithGroup(
        groupId,
        recipeId, 
        user.id
      );
      
      navigation.navigate('RecipeMain');
    } catch (err) {
      console.error('Erreur lors du partage de la recette :', err);
    }
  };

  const handleUnshare = async (recipeId, groupId) => {
    try {
      await unshareRecipeFromGroup(
        groupId,
        recipeId, 
        user.id
      );
      navigation.navigate('RecipeMain');
    } catch (err) {
      console.error('Erreur lors du departage de la recette :', err);
    }
  };

  const handleClone = async (recipe) => {
    try {
      const dto = {
        name: recipe.name,
        categories : recipe.categories,
        prepTime : recipe.prepTime,
        cookTime : recipe.cookTime,
        servings : recipe.servings,
        imageUrl : recipe.imageUrl,
        ownerId :  user.id 
      };

      const created = await addRecipe(dto);
      const recipeId = created.id;
      
      for (const ing of recipe.ingredients) {
        await addIngredientToRecipe({
          recipeId,
          ingredientId: ing.ingredient.id,
          quantity: ing.quantity,
          unitId: ing.unit.id,
        });
      }

      for (const inst of recipe.instructions) {
        await addInstructionToRecipe({
          recipeId,
          stepNumber: inst.stepNumber,
          description: inst.description,
        });
      }

      navigation.navigate('RecipeDetail', {
        recipeId,
        groupId: null,
        isOwner : true,
        isGroupRecipe: false
      });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de la recette");
    }
    
  };

  const handleDelete = async (recipeId) => {
    try {
      await deleteRecipe(
        recipeId
      );
      navigation.navigate('RecipeMain');
    } catch (err) {
      console.error('Erreur lors du departage de la recette :', err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
   try {
      await deleteReview(reviewId);
      setMyReview(null);
      const stats = await getReviewStatsFromRecipe(recipe.id);
      setReviewStats(stats);
    } catch(err) {
      console.error(
        "Erreur suppression avis :",
        err
      );
    }
  };

  const handleEditReview = async (review) => {
    navigation.navigate("ReviewForm", {
      recipeId: recipe.id,
      reviewToEdit: review
    });
  };

  if (loadingRecipe) {
    return <LoadingState />;
  }

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Recette introuvable</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        <View style={styles.cardContainer}>
          <View style={styles.header}>
            <View style={styles.backButtonContainer}>
              <BackButton onPress={() => navigation.goBack()} />
            </View>

            <Text
              style={styles.title}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {recipe.name}
            </Text>
          </View>
          <Image 
            source={
            recipe.imageUrl
              ? { uri: recipe.imageUrl }
              : require('../assets/default.png')
            }
            style={styles.image} 
          />
          <Chipset
            items={recipe?.categories}
            disabled
          />

          {isPublic && (ownerInfo || reviewStats) && (
            <View style={styles.recipeMetaContainer}>
              {ownerInfo && (
                <View style={styles.creatorCompact}>
                  <Image
                    source={
                      ownerInfo.profilePhotoUrl
                        ? { uri: ownerInfo.profilePhotoUrl }
                        : { uri:'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                    }
                    style={styles.creatorAvatar}
                  />
                  <View>
                    <Text style={styles.creatorName}>
                      {ownerInfo.username}
                    </Text>
                    <Text style={styles.creatorLabel}>
                      Créateur
                    </Text>
                  </View>
                </View>
              )}

              {reviewStats && (
                <View style={styles.ratingBadge}>
                  <Icon name="star"  size={17} color="#F5B800"/>
                  <View>
                    <Text style={styles.ratingValue}>
                      {reviewStats.averageRating.toFixed(1)}
                    </Text>
                    <Text style={styles.ratingCount}>
                      {reviewStats.reviewsCount} avis
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {!isGroupRecipe && isOwner && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(recipe.id)}
              >
                <View style={styles.buttonContent}>
                  <Icon name="create-outline" size={18} color="rgb(180, 180, 230)" />
                  <Text style={styles.editButtonText}>Modifier</Text>
                </View>
              </TouchableOpacity>
          )}
          {!isGroupRecipe && isOwner && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowGroupSelector(true)}
            >
              <View style={styles.buttonContent}>
                <Icon name="share-social-outline" size={18} color="rgb(180, 180, 230)" />
                <Text style={styles.editButtonText}>Partager</Text>
              </View>
            </TouchableOpacity>
          )}
          {isGroupRecipe && isOwner && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleUnshare(recipe.id, groupId)}
            >
              <View style={styles.buttonContent}>
                <Icon name="remove-circle-outline" size={18} color="rgb(180, 180, 230)" />
                <Text style={styles.editButtonText}>Retirer du groupe</Text>
              </View>
            </TouchableOpacity>
          )}
          {isPublic && !isOwner && !isGroupRecipe && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleClone(recipe)}
            >
              <View style={styles.buttonContent}>
                <Icon name="copy-outline" size={18} color="rgb(180, 180, 230)" />
                <Text style={styles.editButtonText}>Cloner</Text>
              </View>
            </TouchableOpacity>
          )}
          {!isPublic && isOwner && !isGroupRecipe && ( 
            <TouchableOpacity style={styles.editButton} onPress={() => handleDelete(recipe.id)}>
              <View style={styles.buttonContent}>
              <Icon name="trash-outline" size={18} color="rgb(180, 180, 230)" />
              <Text style={styles.editButtonText}>Supprimer</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeSection}>
            <Text style={styles.timeLabel}>Préparation</Text>
            <Text style={styles.timeValue}>{recipe.prepTime} min</Text>
          </View>
          <View style={styles.separatorVertical} />
          <View style={styles.timeSection}>
            <Text style={styles.timeLabel}>Cuisson</Text>
            <Text style={styles.timeValue}>{recipe.cookTime} min</Text>
          </View>
          <View style={styles.separatorVertical} />
          <View style={styles.timeSection}>
            <Text style={styles.timeLabel}>Total</Text>
            <Text style={styles.timeValue}>{getTotalTime()}</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {/* Tabs */}
          <View style={styles.tabsCard}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'ingredients' && styles.activeTab]}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>Ingrédients</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'instructions' && styles.activeTab]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text style={[styles.tabText, activeTab === 'instructions' && styles.activeTabText]}>Instructions</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'ingredients' && (
            <>
            <View style={styles.servingsContainer}>
              <TouchableOpacity onPress={decreaseServings} style={styles.fabButton}>
                <Icon name="remove-circle-outline" size={24} color="rgb(180, 180, 230)" />
              </TouchableOpacity>
              <Text style={styles.servingsText}>{servings} personnes</Text>
              <TouchableOpacity onPress={increaseServings} style={styles.fabButton}>
                <Icon name="add-circle-outline" size={24} color="rgb(180, 180, 230)" />
              </TouchableOpacity>
            </View>
            <FlatList
              scrollEnabled={false}
              data={recipe.ingredients ?? []}
              keyExtractor={(item) => item.ingredient.id}
              renderItem={({ item }) => (
                <View style={styles.ingredientItem}>
                  <Image source={{ uri:item.ingredient.imageUrl}} style={styles.ingredientImage} />
                  <Text style={styles.ingredientText}>
                    {item.ingredient.name} - {getScaledQuantity(item.quantity)} {item.unit.symbol}
                  </Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.addToShoppingListButton} 
                              onPress={() => {
                              navigation.navigate('AddIngredientToList', {
                                        recipeId: recipe.id,
                                        items: recipe.ingredients,
                                        serving: recipe.servings,
                                      }); }
                              }
            >
              <Text style={styles.addToShoppingListButtonText}>Ajouter à une liste de course</Text>
            </TouchableOpacity>
            </>
          )}

          {activeTab === 'instructions' && (
            <FlatList
              scrollEnabled={false}
              data={recipe.instructions ?? []}
              keyExtractor={(item) => item.stepNumber.toString()}
              renderItem={({ item }) => (
                <View style={styles.instructionItem}>
                  <Text style={styles.stepText}>Étape {item.stepNumber}</Text>
                  <Text style={styles.instructionText}>{item.description}</Text>
                </View>
              )}
            />
          )}
        </View>
        
        {isPublic && reviews && (
          <View style={styles.cardContainer}>

            <Text style={styles.reviewHeaderText}>
              Avis des utilisateurs
            </Text>

            {myReview && (
              <ReviewCard
                review={myReview}
                isMine={true}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                getDayPeriodFromToday={getDayPeriodFromToday}
              />
            )}

            {reviews.length > 0 ? (
              reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isMine={false}
                  getDayPeriodFromToday={getDayPeriodFromToday}
                />
              ))
            ) : !myReview ? (
              <EmptyState
                iconName="chatbubble-ellipses-outline"
                title="Aucun avis"
                message="Soyez le premier à donner votre avis sur cette recette."
              />
            ) : null}

            {hasMoreReviews && reviews.length > 0 && (
              <TouchableOpacity
                style={styles.moreReviewsButton}
                onPress={loadMoreReviews}
                disabled={loadingMoreReviews}
              >
                <Text style={styles.moreReviewsText}>
                  {loadingMoreReviews 
                    ? "Chargement..."
                    : "Voir plus d'avis"
                  }
                </Text>
              </TouchableOpacity>
            )}

            {!myReview && (
              <TouchableOpacity 
                style={styles.moreReviewsButton} 
                onPress={() => {
                  navigation.navigate("ReviewForm", {
                      recipeId: recipe.id,
                      reviewToEdit : null
                  });
                }}
              >
                <Text style={styles.moreReviewsText}>Ajouter un avis</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      <ReusableModal
          visible={showGroupSelector}
          onClose={() => {setShowGroupSelector(false);}}
        >
          <SelectGroupForm
            groups={groups}
            onSave={(selectedGroupId) => { handleShare(recipe.id, selectedGroupId); setShowGroupSelector(false);}}
            onCancel={() => {setShowGroupSelector(false);}}
          />
      </ReusableModal>
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    position: 'relative',
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    elevation: 10,
  },

  title: {
    width: '100%',
    paddingLeft: 50,
    paddingRight: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
    marginVertical: 16,
  },
  recipeMetaContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:10,
    marginBottom:5,
    paddingHorizontal:5,
  },
  creatorCompact:{
    flexDirection:'row',
    alignItems:'center',
  },
  creatorAvatar:{
    width:36,
    height:36,
    borderRadius:18,
    marginRight:10,
  },
  creatorName:{
    fontSize:15,
    fontWeight:'700',
  },
  creatorLabel:{
    fontSize:12,
    color:'#777',
  },
  ratingBadge:{
    flexDirection:'row',
    alignItems:'center',
    gap:6,
    backgroundColor:'#FFF3C4',
    paddingHorizontal:10,
    paddingVertical:6,
    borderRadius:16,
  },
  ratingValue:{
    fontSize:14,
    fontWeight:'bold',
    color:'#C98A00',
  },
  ratingCount:{
    fontSize:11,
    color:'#777',
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
  timeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff', 
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timeSection: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorVertical: {
    width: 1,
    height: '60%',
    backgroundColor: '#ccc',
  },
  tabsCard: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  separator: {
    width: 1,
    height: '60%',
    backgroundColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'rgb(180, 180, 230)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(180, 180, 230)',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 4,
  },
  ingredientText: {
    fontSize: 16,
  },
  instructionItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 15,
    lineHeight: 20,
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  fabButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  servingsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToShoppingListButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  addToShoppingListButtonText: {
    color: 'rgb(180, 180, 230)',
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  editButtonText: {
    color: 'rgb(180, 180, 230)',
    fontWeight: 'bold',
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  reviewCount: {
    fontSize: 15,
    color: 'gray',
    fontWeight: '500',
  },
  reviewHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'start',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 6,
  },
  moreReviewsButton:{
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  moreReviewsText:{
    color:'rgb(180,180,230)',
    fontWeight:'bold'
  },
});