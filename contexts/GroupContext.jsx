import { createContext, useState, useEffect } from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";

export const GroupContext  = createContext();

export function GroupProvider ({ children }) {

  const [groups, setGroups] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadAllGroupsOfAnUser(user.id);
    }
  }, [user]);

  async function loadAllGroupsOfAnUser(userId) {
    try {
      const response = await api.get(`/group-users/${userId}/groups`);
      setGroups(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des groupes: ", err);
    }
  }

  async function addGroup(dto) {
    try {
      const res = await api.post(`/group`, dto);
      const res2 = await api.get(`/group/${res.data.id}`);
      setGroups(prev => [...prev, res2.data]);
      return res2.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function updateGroup(id, dto) {
    try {
      const response = await api.put(`/group/${id}`, dto);
      const updated = response.data;
      setGroups(
        prev => prev.map(group => (group.id === updated.id ? updated : group))
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteGroup(id) {
    try {
      await api.delete(`/group/${id}`);
      setGroups(prev => prev.filter(group => group.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function addUserToGroup(dto) {
    try {
      const response = await api.post(`/group-users`, dto);

      const newMember = response.data;

      setGroups((prevGroup) =>
        prevGroup.map((group) => {
          if (group.id === dto.groupId) {
            return {
              ...group,
              members: [...group.members, newMember],
            };
          }
          return group;
        })
      );

      return newMember;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function inviteUserToGroup(dto) {
    try {
      const response = await api.post(`/group-users/invite`, dto);

      const newMember = response.data;

      setGroups((prevGroup) =>
        prevGroup.map((group) => {
          if (group.id === dto.groupId) {
            return {
              ...group,
              members: [...group.members, newMember],
            };
          }
          return group;
        })
      );

      return newMember;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function updateUserInGroup(id, { userId, role, status }) {
    try {
      const response = await api.put(
        `/group-users/${id}`,
        null,
        {
          params: { userId, role, status },
        }
      );

      const updatedMember = response.data;

      setGroups(prevGroups =>
        prevGroups.map(group => ({
          ...group,
          members: group.members.map(member =>
            member.id === id
              ? { ...member, ...updatedMember }
              : member
          )
        }))
      );

      return updatedMember;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du membre :", err);
      throw err;
    }
  }

  async function removeUserFromGroup(groupId, memberId, removerId) {
    try {
      const params = removerId ? { removerId } : {};

      await api.delete(`/group-users/${memberId}`, {
        params,
      });

      setGroups(prevGroups =>
        prevGroups.map(group =>
          group.id === groupId
            ? {
                ...group,
                members: group.members.filter(m => m.id !== memberId),
              }
            : group
        )
      );

    } catch (err) {
      console.error("Erreur suppression membre:", err);
      throw err;
    }
  }

  async function transferOwnership(groupId, newOwnerId) {
    try {
      await api.put(
        `/group-users/${groupId}/transfer-ownership/${newOwnerId}`,
        {},
      );

    setGroups((prevGroups) =>
        prevGroups.map((group) => {
            if (group.id === groupId) {
            return {
                ...group,
                members: group.members.map(member =>
                  member.user.id === newOwnerId
                    ? { ...member, role: "OWNER" }
                    : member.user.id === group.ownerId
                      ? { ...member, role: "ADMIN" }
                      : member
                ),
                ownerId: newOwnerId,
              };
            }
            return group;
        })
        );

    } catch (err) {
      console.error("Erreur transfert ownership :", err);
      throw err;
    }
  }

  return (
    <GroupContext.Provider
      value={{
        groups,
        loadAllGroupsOfAnUser,
        addGroup,
        updateGroup,
        deleteGroup,
        addUserToGroup,
        inviteUserToGroup,
        updateUserInGroup,
        removeUserFromGroup,
        transferOwnership,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}