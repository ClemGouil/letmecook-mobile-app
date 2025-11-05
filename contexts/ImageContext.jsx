import { createContext, useState } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";

export const ImageContext = createContext();

export function ImageProvider({ children }) {

    const API_URL = "http://192.168.1.13:8080/api";

    const { token } = useUser();

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

        const response = await axios.post(`${API_URL}/images/upload`, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
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
