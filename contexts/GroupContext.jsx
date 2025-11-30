import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";

export const GroupContext  = createContext();

export function GroupProvider ({ children }) {

  const [groups, setGroups] = useState([]);

  const { user, token } = useUser();

  useEffect(() => {
    if (user) {
      loadAllGroupsOfAnUser(user.id);
    }
  }, [user]);

  const API_URL = "http://192.168.1.13:8080/api";

  async function loadAllGroupsOfAnUser(userId) {
    try {
      const response = await axios.get(`${API_URL}/group-users/${userId}/groups`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setGroups(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des groupes: ", err);
    }
  }

  async function addGroup(dto) {
    try {
      const res = await axios.post(`${API_URL}/group`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res2 = await axios.get(`${API_URL}/group/${res.data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(prev => [...prev, res2.data]);
      return res2.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function updateGroup(id, dto) {
    try {
      const response = await axios.put(`${API_URL}/group/${id}`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      await axios.delete(`${API_URL}/group/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(prev => prev.filter(group => group.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function addUserToGroup(dto) {
    try {
      const response = await axios.post(`${API_URL}/group-users`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const response = await axios.post(`${API_URL}/group-users/invite`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const response = await axios.put(
        `${API_URL}/group-users/${id}`,
        null,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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

      await axios.delete(`${API_URL}/group-users/${memberId}`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
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
      await axios.put(
        `${API_URL}/group-users/${groupId}/transfer-ownership/${newOwnerId}`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
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