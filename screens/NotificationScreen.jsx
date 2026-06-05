import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useNotif } from '../hooks/useNotif'
import { useDate } from '../hooks/useDate';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationScreen() {

  const navigation = useNavigation();

  const { notifications, markAsRead } = useNotif();
  const { formatDateToLocalYYYYMMDD, getDayLabel } = useDate();

  const handleMarkAsRead = async (notif) => {
    if (!notif.read) {
      try {
        await markAsRead(notif.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const markAllAsRead = () => {
    notifications.map(notif => {markAsRead(notif.id)});
  };

  const groupNotificationsByDay = (notifications) => {
    const groups = {};

    notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .forEach((notif) => {
        const date = new Date(notif.createdAt);

        const dayKey = formatDateToLocalYYYYMMDD(date);

        if (!groups[dayKey]) {
          groups[dayKey] = [];
        }

        groups[dayKey].push(notif);
      });

    return groups;
  };

  const groupedNotifications = groupNotificationsByDay(notifications);
  const sections = Object.keys(groupedNotifications);

return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes Notifications</Text>
          <View style={{ width: 24 }} />
        </View>

        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Tout marquer comme lu</Text>
        </TouchableOpacity>

        <ScrollView style={styles.notificationsContainer}>
          {sections.map((section) => (
            <View key={section}>
              <Text style={styles.sectionTitle}>{getDayLabel(section)}</Text>

              {groupedNotifications[section].map((notif) => (
                <TouchableOpacity
                  key={notif.id}
                  onPress={() => handleMarkAsRead(notif)}
                  style={[
                    styles.notificationItem,
                    notif.read
                      ? styles.readNotification
                      : styles.unreadNotification,
                  ]}
                >
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>
                      {notif.title}
                    </Text>

                    <Text style={styles.notificationDate}>
                      {new Date(notif.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.notificationMessage}>
                    {notif.message}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: '100%',
    backgroundColor: '#858585',
    elevation: 2,
    borderBottomWidth: 0.3,
    borderColor: '#ddd',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  notificationsContainer: {
    padding: 10,
  },
  notificationItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  unreadNotification: {
    backgroundColor: '#ffff',
  },
  readNotification: {
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
  },
  notificationMessage: {
    fontSize: 14,
  },
  markAllButton: {
    alignSelf: 'center',
    backgroundColor: 'rgb(180, 180, 230)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 6,
  },
  markAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});