import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_URL_BACKEND}/api`
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {

    console.log("ERROR STATUS:", error.response?.status);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      console.log("ACCESS TOKEN EXPIRED");

      originalRequest._retry = true;

      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      console.log("REFRESH TOKEN FOUND:", !!refreshToken);

      try {

        console.log("CALL /auth/refresh");

        const res = await axios.post(
          `${process.env.EXPO_PUBLIC_URL_BACKEND}/api/users/auth/refresh`,
          { refreshToken }
        );

        console.log("REFRESH SUCCESS");

        const {
          accessToken,
          refreshToken: newRefresh
        } = res.data;

        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", newRefresh);

        console.log("TOKENS UPDATED");

        originalRequest.headers.Authorization =
          `Bearer ${accessToken}`;

        return api(originalRequest);

      } catch (err) {

        console.log(
          "REFRESH FAILED",
          err.response?.status,
          err.response?.data
        );

        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);