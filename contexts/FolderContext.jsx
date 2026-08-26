import { createContext, useState, useEffect } from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";

export const FolderContext  = createContext();

export function FolderProvider ({ children }) {

  const [folders, setFolders] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadAllFoldersOfAnUser(user.id);
    }
  }, [user]);

  async function loadAllFoldersOfAnUser(userId) {
    try {
      const response = await api.get(`/folders/user/${userId}`);
      setFolders(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des folders :", err);
      throw err;
    }
  }

  async function addFolder(folder) {
    try {
      const response = await api.post(`/folders`, folder);
      const createdFolder = response.data;
      setFolders(prev => [...prev, {... createdFolder, recipeCount: 0}]);
      return createdFolder;
    } catch (err) {
      console.error("Erreur lors de la création du folder :", err);
      throw err;
    }
  }

  async function updateFolder(id, name) {
    try {
      const response = await api.put(`/folders/${id}`, { name });
      const updated = response.data;
      setFolders(
        prev => prev.map(folder => (folder.id === updated.id ? { ...folder, name: updated.name } : folder))
      );
      return updated;
    } catch (err) {
      console.error("Erreur lors de la modification du folder :", err);
      throw err;
    }
  }

  async function deleteFolder(id) {
    try {
      await api.delete(`/folders/${id}`);
      setFolders(prev => prev.filter(folder => folder.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression du folder :", err);
      throw err;
    }
  }

  async function loadRecipesOfFolder(folderId, query, limit = 10, offset = 0) {
    try {
      const response = await api.get(`/folders-recipes/${folderId}`,
        {
          params: {
            query,
            limit,
            offset
          }
      });

      return response.data;
    } catch (err) {
      console.error(
        "Erreur lors du chargement des recettes du folder :",
        err
      );
      throw err;
    }
  }

  async function addRecipeToFolder(folderId, recipeId) {
    try {
      const response = await api.post(
        `/folders-recipes/${folderId}/recipes/${recipeId}`
      );

      setFolders(prev =>
        prev.map(folder =>
          folder.id === folderId
            ? {
                ...folder,
                recipeCount: folder.recipeCount + 1
              }
            : folder
        )
      );

      return response.data;
    } catch (err) {
      console.error(
        "Erreur lors de l'ajout de la recette au folder :",
        err
      );
      throw err;
    }
  }

  async function removeRecipeFromFolder(folderId, recipeId) {
    try {
      await api.delete(
        `/folders-recipes/${folderId}/recipes/${recipeId}`
      );

      setFolders(prev =>
        prev.map(folder =>
          folder.id === folderId
            ? {
                ...folder,
                recipeCount: Math.max(0, folder.recipeCount - 1)
              }
            : folder
        )
      );
    } catch (err) {
      console.error(
        "Erreur lors de la suppression de la recette du folder :",
        err
      );
      throw err;
    }
  }

  return (
    <FolderContext.Provider
      value={{
        folders,
        loadAllFoldersOfAnUser,
        addFolder,
        updateFolder,
        deleteFolder,
        loadRecipesOfFolder,
        addRecipeToFolder,
        removeRecipeFromFolder
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}