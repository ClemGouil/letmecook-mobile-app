import { createContext, useState } from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";

export const ImageContext = createContext();

export function ImageProvider({ children }) {

    async function uploadImage(fileUri) {
        try {
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: filename,
            type,
        });

        const response = await api.post(`/images/upload`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.imageUrl;
        } catch (err) {
        console.error("Erreur lors de l'upload de l'image :", err);
        throw err;
        }
    }

    return (
    <ImageContext.Provider
      value={{
        uploadImage
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
