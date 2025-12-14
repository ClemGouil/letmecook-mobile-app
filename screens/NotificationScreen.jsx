import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useNotif } from '../hooks/useNotif'
// import { useWSNotif } from '../hooks/useNotifWS';

export default function NotificationScreen() {

  const navigation = useNavigation();

  const { notifications, markAsRead } = useNotif();

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
    notifications.map(notif => {markAsRead(notif)});
  };

  const unreadNotifications = notifications
    .filter(n => !n.read)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const readNotifications = notifications
    .filter(n => n.read)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

return (
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
        {unreadNotifications.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Notifications Non lues</Text>
            {unreadNotifications.map(notif => (
              <TouchableOpacity
                key={notif.id}
                onPress={() => handleMarkAsRead(notif)}
                style={[styles.notificationItem, styles.unreadNotification]}
              >
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notif.title}</Text>
                  <Text style={styles.notificationDate}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.notificationMessage}>{notif.message}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {readNotifications.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Notifications Lues</Text>
            {readNotifications.map(notif => (
              <View
                key={notif.id}
                style={[styles.notificationItem, styles.readNotification]}
              >
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notif.title}</Text>
                  <Text style={styles.notificationDate}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.notificationMessage}>{notif.message}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
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