import React, { useState, useEffect } from 'react';
import { Text, TextInput , View, ScrollView, TouchableOpacity, StyleSheet, Image, Switch} from 'react-native';
import { useUser } from '../hooks/useUser';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AccordionSection from '../components/AccordionSection'
import { useGroup } from '../hooks/useGroup';
import FloatingButton  from '../components/FloatingButton';
import ReusableModal from '../components/ReusableModal';
import ChooseNameModal from '../components/ChooseNameModal';
import { Alert } from 'react-native';
import SelectNewOwnerForm from '../components/SelectNewOwnerForm';

export default function GroupScreen() {

    const navigation = useNavigation();

    const { user } = useUser();

    const { groups, addGroup, inviteUserToGroup, updateUserInGroup, removeUserFromGroup, deleteGroup, transferOwnership} = useGroup();

    const [addingGroup, setAddingGroup] = React.useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    const [transferingOwnership, setTransferingOwnership] = React.useState(false);
    const [transferGroup, setTransferGroup] = useState(null);

    const pendingGroups = groups.filter(g =>
        g.members.some(m => m.user.id === user.id && m.status === "PENDING")
    );

    const activeGroups = groups.filter(g =>
        g.members.some(m => m.user.id === user.id && m.status === "ACTIVE")
    );

    const canDeleteGroup = (userId, group) => {
      return group.ownerId === userId;
    }

    const canQuitGroup = (userId, group) => {
      return true;
    }

    const canInvite = (userRole) => {
      return userRole === "OWNER" || userRole === "ADMIN";
    }

    const canEditGroup =(userRole) => {
      return userRole === "OWNER" || userRole === "ADMIN";
    }

    const handleAdd = async (name) => {
      console.log(name);
      try {
        const newGroup = await addGroup(
          { name,
            ownerId: user.id,
            members: [],
          });
        setAddingGroup(false);
      } catch (err) {
        console.error('Erreur lors de la création du groupe :', err);
      }
    };

    const acceptInvitation = async (group) => {
      const member = group.members.find(m => m.user.id === user.id);
      if (!member || member.status !== 'PENDING') return;

      try {
        await updateUserInGroup(member.id,{
          userId: member.user.id,
          role: member.role,
          status: 'ACTIVE',
        });
      } catch (err) {
        console.error("Erreur acceptation invitation :", err);
      }
    };

    const refuseInvitation = async (group) => {
      const member = group.members.find(m => m.user.id === user.id);
      if (!member || member.status !== 'PENDING') return;

      try {
        await removeUserFromGroup(group.id, member.id);
      } catch (err) {
        console.error("Erreur refus invitation :", err);
      }
    };

    const confirmDeleteGroup = async (group) => {
      Alert.alert(
        "Supprimer le groupe",
        `Voulez-vous vraiment supprimer le groupe "${group.name}" ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteGroup(group.id);
              } catch (err) {
                console.error("Erreur suppression groupe :", err);
              }
            }
          }
        ]
      );
    };

    const leaveGroup = async (group) => {
      const member = group.members.find(m => m.user.id === user.id);
      if (!member) return;

      const isOwner = group.ownerId === user.id;

      if (isOwner) {
        const otherMembers = group.members.filter(m => m.user.id !== user.id && m.status === 'ACTIVE');
        if (otherMembers.length === 0) {
          Alert.alert("Impossible de quitter", "Aucun autre membre pour transférer la propriété.");
          return;
        }
        setTransferingOwnership(true);
        setTransferGroup(group);
      } else {
        Alert.alert(
          "Quitter le groupe",
          `Voulez-vous vraiment quitter le groupe "${group.name}" ?`,
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Quitter",
              style: "destructive",
              onPress: async () => {
                try {
                  await removeUserFromGroup(group.id, member.id);
                } catch (err) {
                  console.error("Erreur quitter groupe :", err);
                }
              }
            }
          ]
        );
      }
    };

    const handleTransferOwnerShip = async (group, newOwnerId) => {
      try {
        const member = group.members.find(m => m.user.id === user.id);
        await transferOwnership(group.id, newOwnerId);
        await removeUserFromGroup(group.id, member.id);

        setTransferingOwnership(false);
        setTransferGroup(null);
      } catch (err) {
        console.error("Erreur quitter groupe :", err);
      }
    };

    return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes groupes</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {pendingGroups.length > 0 && (
            pendingGroups.map(group => (
            <AccordionSection title={`Invitation à rejoindre ${group.name}`}>
                <View style={styles.pendingButtonsRow}>
                <TouchableOpacity style={styles.textButton} onPress={() => acceptInvitation(group)} >
                    <Icon name="checkmark" size={22} color="green" />
                    <Text style={[styles.textButtonLabel, { color: "green" }]}>Accepter</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.textButton} onPress={() => refuseInvitation(group)} >
                    <Icon name="close" size={22} color="red" />
                    <Text style={[styles.textButtonLabel, { color: "red" }]}>Refuser</Text>
                </TouchableOpacity>
                </View>
            </AccordionSection>
            ))
        )}

        {activeGroups.length > 0 ? (
            activeGroups.map(group => {

              const member = group.members.find(m => m.user.id === user.id);
              const role = member?.role;

              return (
                <AccordionSection title={group.name} key={group.id}>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionButton,!canEditGroup(role) && { opacity: 0.2 }]}
                      onPress={() => console.log("Modifier", group.id)}
                      disabled={!canEditGroup(role)}
                    >
                      <Icon name="create-outline" size={20} color="#3f51b5" />
                      <Text style={styles.actionLabel}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton,!canQuitGroup(user.id, group) && { opacity: 0.2 }]}
                      onPress={() => leaveGroup(group)}
                      disabled={!canQuitGroup(user.id, group)}
                    >
                      <Icon name="exit-outline" size={20} color="orange" />
                      <Text style={[styles.actionLabel, { color: "orange" }]}>Quitter</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.table}>
                    <View style={[styles.row, styles.headerRow]}>
                      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>Nom</Text>
                      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>Rôle</Text>
                      <Text style={[styles.cell, styles.headerCell]}>Adhésion</Text>
                    </View>

                    {group.members.map((member) => (
                      <View key={member.id} style={styles.row}>
                        <Text style={[styles.cell, styles.borderRight]}>{member.user.username}</Text>
                        <Text style={[styles.cell, styles.borderRight]}>{member.role}</Text>
                        <Text style={styles.cell}>{member.joinedAt}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionButton,!canInvite(role) && { opacity: 0.2 }]}
                      onPress={() => console.log("Inviter", group.id)}
                      disabled={!canInvite(role)}
                    >
                      <Icon name="person-add-outline" size={20} color="#3f51b5" />
                      <Text style={styles.actionLabel}>Inviter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton,!canDeleteGroup(user.id, group) && { opacity: 0.2 }]}
                      onPress={() => confirmDeleteGroup(group)}
                      disabled={!canDeleteGroup(user.id, group)}
                    >
                      <Icon name="trash-outline" size={20} color="red" />
                      <Text style={[styles.actionLabel, { color: "red" }]}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>

                </AccordionSection>
              );
            })
          ) : (
            <Text style={styles.noGroupText}>Vous ne faites partie d’aucun groupe.</Text>
          )}

        <ChooseNameModal
          visible={addingGroup}
          title={"Nom du groupe :"}
          placeholder={"Famille"} 
          onSubmit={handleAdd}
          onCancel={() => setAddingGroup(false)}
        />
      </ScrollView>
      <FloatingButton onPress={() => setAddingGroup(true)}/>

      {transferGroup &&
      <ReusableModal
          visible={transferingOwnership}
          onClose={() => {setTransferingOwnership(false); setTransferGroup(null)}}
        >
          <SelectNewOwnerForm
            members={transferGroup.members.filter(m => m.user.id !== user.id && m.status === "ACTIVE")}
            group={transferGroup}
            onSave={handleTransferOwnerShip}
            onCancel={() => {setTransferingOwnership(false); setTransferGroup(null)}}
          />
      </ReusableModal>
      }
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
    backgroundColor: '#fff',
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
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  pendingButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 4,
  },
  textButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  table: {
    minWidth: 300,
  },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgb(180, 180, 230)',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  headerRow: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#fbcfe8rgb(180, 180, 230)',
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3f51b5",
  },
});