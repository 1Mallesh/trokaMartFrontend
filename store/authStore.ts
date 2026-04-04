import { create } from "zustand";
import { loginUser, registerUser, resetPassword } from "../app/services/auth";

interface AuthStore {
  user: any;
  token: string | null;
  loginMethod: string | null;
  register: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
  setGoogleAuth: (user: any, token: string) => void;
  initiateGoogleLogin: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loginMethod: null,

  register: async (data: any) => {
    const res = await registerUser(data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    set({ user: res.data.user, token: res.data.token, loginMethod: "email" });
  },

  login: async (data: any) => {
    const res = await loginUser(data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    set({ user: res.data.user, token: res.data.token, loginMethod: "email" });
  },

  resetPassword: async (data: any) => {
    await resetPassword(data);
  },

  setGoogleAuth: (user: any, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("loginMethod", "google");

    set({ user, token, loginMethod: "google" });
  },

  initiateGoogleLogin: () => {
    localStorage.setItem("loginMethod", "google");
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${backendUrl}/auth/google`;
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null, loginMethod: null });
  },
}));