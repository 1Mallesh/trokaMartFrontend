import { create } from "zustand";
import { loginUser, registerUser, resetPassword } from "../app/services/auth";

interface AuthStore {
  user: any;
  token: string | null;
  register: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  register: async (data: any) => {
    const res = await registerUser(data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    set({ user: res.data.user, token: res.data.token });
  },

  login: async (data: any) => {
    const res = await loginUser(data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    set({ user: res.data.user, token: res.data.token });
  },

  resetPassword: async (data: any) => {
    await resetPassword(data);
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null });
  },
}));