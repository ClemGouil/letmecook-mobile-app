import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useMealPlanning } from '../hooks/useMealPlanning';
import SelectRecipeModal from '../components/SelectRecipeModal';
import { useUser } from '../hooks/useUser'
import { useRecipe } from '../hooks/useRecipe'
import { useNavigation} from '@react-navigation/native';
import FloatingButton  from '../components/FloatingButton';
import ReusableModal from '../components/ReusableModal';
import {Calendar, LocaleConfig} from 'react-native-calendars';

export default function MealPlanningScreen() {

  const navigation = useNavigation();
  const { user} = useUser();
  const { mealPlannings, loadMealPlanning ,addMealPlanning, deleteMealPlanning} = useMealPlanning();
  const { privateRecipes } = useRecipe();

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [groupedMealPlannings, setGroupedMealPlannings] = useState([]);
  const [recipesMap, setRecipesMap] = useState({});

  const [showModalSelectRecipe, setShowModalSelectRecipe] = useState(false);
  const [generatingShoppingList, setGeneratingShoppingList] = React.useState(false);
  const [showModalGeneratingShoppingListFromRange, setShowModalGeneratingShoppingListFromRange] = React.useState(false);

  const [selectedDay, setSelectedDay] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const [takenMealTypes, setTakenMealTypes] = useState([]);
  const [availableMealTypes, setAvailableMealTypes] = useState([]);

  LocaleConfig.locales['fr'] = {
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
  };

  LocaleConfig.defaultLocale = 'fr';

  useEffect(() => {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    setStartDate(start);
    setEndDate(end);
  }, []);

  useEffect(() => {
    const map = {};
    privateRecipes.forEach((r) => {
      map[r.id] = r;
    });
    setRecipesMap(map);
  }, [privateRecipes]);

  useEffect(() => {
    if (user && startDate && endDate) {
      const startStr = formatDateToLocalYYYYMMDD(startDate);
      const endStr = formatDateToLocalYYYYMMDD(endDate);
      loadMealPlanning(user.id, startStr, endStr);
    }
  }, [user, startDate, endDate]);

  useEffect(() => {
    if (recipesMap && mealPlannings.length > 0) {
      groupMealPlanning();
    } else {
      const days = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        days.push({ date: formatDateToLocalYYYYMMDD(d), meals: {} });
      }
      setGroupedMealPlannings(days);
    }
  }, [mealPlannings, recipesMap, startDate, endDate]);

  const moveBackward = () => {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    const days = (newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24);

    newStart.setDate(startDate.getDate() - days - 1);
    newEnd.setDate(endDate.getDate() - days - 1);

    setStartDate(newStart);
    setEndDate(newEnd);
  }

  const moveForward = () => {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    const days = (newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24);

    newStart.setDate(startDate.getDate() + days + 1);
    newEnd.setDate(endDate.getDate() + days + 1);

    setStartDate(newStart);
    setEndDate(newEnd);
  }

  const formatDateRange = () => {
    const options = { day: 'numeric', month: 'short' };
    return `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`;
  };

  const formatDateToLocalYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const groupMealPlanning = () => {
    const days = [];
    for(let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDateToLocalYYYYMMDD(d);
      days.push({
        date: dateStr,
        meals: {}
      });
    }

    mealPlannings.forEach(mp => {
      const date = new Date(mp.date);
      const dateStr = formatDateToLocalYYYYMMDD(date);
      const day = days.find(d => d.date === dateStr);
      if(day) {
        day.meals[mp.mealType] = { 
          id: mp.id,
          recipe: recipesMap[mp.recipeId], 
          servings: mp.servings ?? recipesMap[mp.recipeId].servings };;
      }
    });
    setGroupedMealPlannings(days);
  }

  const getDayLabel = (dateStr) => {
    const date = new Date(dateStr);
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    return `${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]}`;
  };

  const getMealType = (mt) => {
    const mealtype = { BREAKFAST : 'Petit-déjeuner', LUNCH : 'Déjeuner', DINNER : 'Dîner'}
    return mealtype[mt];
  };

  const getReverseMealType = (mt) => {
    const mealtype = { 'Petit-déjeuner' : 'BREAKFAST', 'Déjeuner' : 'LUNCH' , 'Dîner' : 'DINNER' }
    return mealtype[mt];
  };

  const isToday =  (dateStr) => {
    const today = new Date();
    const todayStr = formatDateToLocalYYYYMMDD(today);
    return todayStr === dateStr;
  }

  const isTomorrow =  (dateStr) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDateToLocalYYYYMMDD(tomorrow);
    return tomorrowStr === dateStr;
  }

  const  handleAddPlanning = async (selectedRecipe, selectedServings, mealType) => {
    try {
      await addMealPlanning({
        userId: user.id,
        recipeId: selectedRecipe.id,
        servings: selectedServings,
        mealType: getReverseMealType(mealType),
        date: selectedDay,
    });
      setShowModalSelectRecipe(false);
    } catch (err) {
      console.error('Erreur lors de l ajout du planning :', err);
    }
  };

  const handleDeletePlanning = async (id) => {
    try {
      await deleteMealPlanning(id);
    } catch (err) {
      console.error('Erreur lors de la suppresion du planning :', err);
    }
  };

  const handlePressRecipe = (recipeId) => {
    navigation.navigate('RecipeDetail', { recipeId : recipeId });
  };

  const handleGenerateWeekShoppingList = () => {
    
  };

  const handleGenerateShoppingListFromRange = () => {
    console.log(dateRange)
    setShowModalGeneratingShoppingListFromRange(false); 
    setDateRange({ start: null, end: null });
  };

  const generateMarkedDates = (start, end) => {
    if (!start) return {};

    const markedDates = {};
    let current = new Date(start);
    const endDate = end ? new Date(end) : null;

    if (!end) {
      const dateStr = current.toISOString().split('T')[0];
      markedDates[dateStr] = {
        selected: true,
        color: 'rgb(100, 100, 200)',
        textColor: 'white',
        borderRadius: 8,
      };
      return markedDates;
    }

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const isStart = dateStr === start;
      const isEnd = dateStr === end;

      markedDates[dateStr] = {
        selected: true,
        color: isStart ? 'rgb(100, 100, 200)' : isEnd ? 'rgb(50, 50, 150)' : 'rgb(180, 180, 230)',
        textColor: 'white',
        borderRadius: 8,
      };

      current.setDate(current.getDate() + 1);
    }
    return markedDates;
  };

  return (
    <View style={styles.container}>
      <View style={styles.bannerTop}>
        <TouchableOpacity style={styles.moveButtonLeft} onPress={() => moveBackward()}>
          <Icon name="chevron-back-outline" size={30} color="rgb(180, 180, 230)" style={styles.iconStyle}/>
        </TouchableOpacity>
        <Text style={styles.dateText}> {formatDateRange()} </Text>
        <TouchableOpacity style={styles.moveButtonRight} onPress={() => moveForward()}>
          <Icon name="chevron-forward-outline" size={30} color="rgb(180, 180, 230)" style={styles.iconStyle}/>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>
        {groupedMealPlannings.map((day, index) => {
          const possibleMealTypes = ["BREAKFAST", "LUNCH", "DINNER"];
          const takenMealTypes = Object.keys(day.meals);
          const availableMealTypes = possibleMealTypes.filter(
            (type) => !takenMealTypes.includes(type)
          );
        return (
            <View key={index} style={styles.dayCard}>
              <View style={styles.dateContainer}>
                <Text style={styles.dayTitle}>{isToday(day.date) ? "Aujourd'hui" : isTomorrow(day.date) ? "Demain" : getDayLabel(day.date)}</Text>
                <TouchableOpacity  
                  style={[ styles.addButton, availableMealTypes.length === 0 && { opacity : 0.2 }]} 
                  onPress={() => {
                    setSelectedDay(day.date);
                    setTakenMealTypes(takenMealTypes);
                    setAvailableMealTypes(availableMealTypes.map((mt) => getMealType(mt)));
                    setShowModalSelectRecipe(true); }}
                  disabled={availableMealTypes.length === 0}
                    >
                  <Icon name="add-outline" size={20} color="rgb(180, 180, 230)"/>
                </TouchableOpacity>
              </View>
              {Object.entries(day.meals).map(([mealType, meal], idx) => (
                <TouchableOpacity key={idx} style={styles.mealCard} onPress={() => handlePressRecipe(meal.recipe.id)}>
                    <Image
                      source={{ uri: meal.recipe.imageUrl }}
                      style={styles.recipeImage}
                    />
                    <View style={styles.mealInfo}>
                      <Text style={styles.recipeTitle}>{meal.recipe.name }</Text>
                      <Text style={styles.mealType}>{getMealType(mealType)}</Text>
                      <Text style={styles.mealType}>{meal.servings} Personnes</Text>
                    </View>
                    <TouchableOpacity  style={styles.deleteButton} onPress={() => handleDeletePlanning(meal.id)}>
                      <Icon name="trash-outline" size={20} color="rgb(180, 180, 230)"/>
                    </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )
        })}
      </ScrollView>

      <SelectRecipeModal
        visible={showModalSelectRecipe}
        availableMealTypes = {availableMealTypes}
        onSubmit={handleAddPlanning}
        onCancel={() => {setShowModalSelectRecipe(false)}}
      />

      <ReusableModal
        visible={generatingShoppingList}
        onClose={() => setGeneratingShoppingList(false)}
      >
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => { handleGenerateWeekShoppingList; setGeneratingShoppingList(false);}}>
              <Text style={styles.buttonText}>Générer la liste de course de la semaine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {setShowModalGeneratingShoppingListFromRange(true); setGeneratingShoppingList(false);}}>
              <Text style={styles.buttonText}>Générer la liste de course à partir d'une plage</Text>
          </TouchableOpacity>
      </View>
      </ReusableModal>

      <FloatingButton
        onPress={() => {setGeneratingShoppingList(true);}}
        iconName="receipt-outline"
      ></FloatingButton>

      <ReusableModal
        visible={showModalGeneratingShoppingListFromRange}
        onClose={() => {setShowModalGeneratingShoppingListFromRange(false); setDateRange({ start: null, end: null }); }}
      >
        <View style={styles.modalContainer}>
          <Calendar
            markingType={'period'}
            markedDates={{
              ...generateMarkedDates(dateRange.start, dateRange.end),
            }}
            onDayPress={(day) => {
              if (!dateRange.start || (dateRange.start && dateRange.end)) {
                setDateRange({ start: day.dateString, end: null });
              } else if (dateRange.start && !dateRange.end) {
                if (day.dateString >= dateRange.start) {
                  setDateRange({ ...dateRange, end: day.dateString });
                } else {
                  setDateRange({ start: day.dateString, end: null });
                }
              }
            }}
          />
          <View style={styles.buttonRowModal}>
              <TouchableOpacity 
                style={[styles.saveButton, !(dateRange.start && dateRange.end) && styles.disabledButton]}
                disabled={!(dateRange.start && dateRange.end)}
                onPress={handleGenerateShoppingListFromRange}>
                  <Text style={styles.saveText}>Générer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => {setShowModalGeneratingShoppingListFromRange(false); setDateRange({ start: null, end: null }); }}>
                  <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
          </View>
        </View>
      </ReusableModal>

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:10,
    flex: 1,
    padding: 8,
  },
  bannerTop: {
    flexDirection: 'row',
    backgroundColor : '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding : 4,
    borderRadius : 50,
  },
  moveButtonRight: {
    padding: 4,
    borderLeftWidth: 2,
    borderRadius : 5,
    borderColor : 'rgb(180, 180, 230)'
  },
  moveButtonLeft: {
    padding: 4,
    borderRightWidth: 2,
    borderRadius : 5,
    borderColor : 'rgb(180, 180, 230)'
  },
  iconStyle: {
    // Ajoutez si besoin
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    borderWidth : 2,
    borderColor : 'rgb(180, 180, 230)',
    paddingHorizontal: 10
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 10,
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  mealType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  servings: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton : {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  addButton : {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 2,
    marginHorizontal: 2,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(180, 180, 230)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(180, 180, 230)',
    textAlign: 'center',
  },
  buttonRowModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'rgb(100, 100, 200)',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});