import axios from "axios";
import { keycloak } from "../auth/AuthProvider";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use(
  async (config) => {
    if (keycloak.token) {
      try {
        // refresh if token will expire in next 30 seconds
        await keycloak.updateToken(30);

        config.headers.Authorization = `Bearer ${keycloak.token}`;
      } catch (err) {
        console.error("Token refresh failed", err);
        keycloak.login(); // force re-login if refresh fails
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default instance;
