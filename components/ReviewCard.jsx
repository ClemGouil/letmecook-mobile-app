import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating-widget';

const ReviewCard = ({ 
  review, 
  isMine = false,
  onEdit,
  onDelete,
  getDayPeriodFromToday
}) => {

  return (
    <View style={styles.reviewContainer}>

      <View style={styles.reviewHeader}>

        <View style={styles.userInfo}>

          <Image
            source={{
              uri:
                review.user?.profilePhotoUrl ||
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            }}
            style={styles.reviewAvatar}
          />

          <Text style={styles.username}>
            {review.user?.username ?? "Utilisateur"}
          </Text>

          {isMine && (
            <Text style={styles.myReviewBadgeText}>
              (Mon avis)
            </Text>
          )}

        </View>


        {isMine && (
          <View style={styles.reviewActions}>

            <TouchableOpacity
              style={styles.actionReviewButton}
              onPress={() => onEdit(review)}
            >
              <Icon
                name="create-outline"
                size={18}
                color="rgb(180,180,230)"
              />
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.actionReviewButton}
              onPress={() => onDelete(review.id)}
            >
              <Icon
                name="trash-outline"
                size={18}
                color="rgb(180,180,230)"
              />
            </TouchableOpacity>

          </View>
        )}

      </View>


      <View style={styles.reviewMeta}>

        <StarRating
          rating={review.rating}
          onChange={() => {}}
          starSize={15}
        />


        <Text style={styles.dateText}>
          {getDayPeriodFromToday(review.createdAt)}
        </Text>

      </View>


      <Text style={styles.reviewContent}>
        {review.content}
      </Text>

    </View>
  );
};


const styles = StyleSheet.create({

  reviewContainer: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgb(180,180,230)',
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  reviewAvatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginRight: 10,
  },

  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  myReviewBadgeText: {
    color: 'rgb(180,180,230)',
    fontSize: 13,
    fontWeight: '600',
    paddingLeft: 3,
  },

  reviewActions: {
    flexDirection: 'row',
    gap: 6,
  },

  actionReviewButton: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: 'rgb(180,180,230)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  dateText: {
    fontSize: 12,
    color: '#666',
  },

  reviewContent: {
    fontSize: 16,
    color: '#333',
  },

});


export default ReviewCard;