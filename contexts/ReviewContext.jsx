import { createContext, useState, useEffect} from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";

export const ReviewContext = createContext();

export function ReviewProvider({ children }) {

    async function getReviewsFromRecipe(recipeId, limit = 5, offset = 0, append = false) {
        try {
            const response = await api.get(`/recipe-reviews/${recipeId}`, {
                params: {
                limit,
                offset,
                },
            });

            const reviews = response.data;

            return reviews;

        } catch (err) {
            console.error("Erreur lors de la recuperations des avis :", err);
            throw err;
        }
    }

    async function getReviewStatsFromRecipe(recipeId) {
        try {
            const response = await api.get(`/recipe-reviews/${recipeId}/stats`);

            return response.data;

        } catch (err) {
            console.error("Erreur lors de la récupération des statistiques :", err);
            throw err;
        }
    }

    async function createReview(review) {
        try {
            const response = await api.post(`/recipe-reviews/`, review);

            return response.data;

        } catch (err) {
            console.error("Erreur lors de la création de l'avis :", err);
            throw err;
        }
    }

    async function updateReview(id, review) {
        try {
        const response = await api.put(`/recipe-reviews/${id}`, review);

        return response.data;

        } catch (err) {
        console.error("Erreur lors de la modification de l'avis :", err);
        throw err;
        }
    }

    async function deleteReview(id) {
        try {
        await api.delete(`/recipe-reviews/${id}`);

        } catch (err) {
        console.error("Erreur lors de la suppression de l'avis :", err);
        throw err;
        }
    }

    return (
        <ReviewContext.Provider
          value={{
            getReviewsFromRecipe,
            getReviewStatsFromRecipe,
            createReview,
            updateReview,
            deleteReview
          }}
        >
          {children}
        </ReviewContext.Provider>
      );
}