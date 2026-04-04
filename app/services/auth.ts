import { API } from "./api";

export const registerUser = async (data: any) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: any) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const requestPasswordReset = async (data: any) => {
  const res = await API.post("/auth/request-reset", data);
  return res.data;
};

export const verifyResetOtp = async (data: any) => {
  const res = await API.post("/auth/verify-reset-otp", data);
  return res.data;
};

export const resetPassword = async (data: any) => {
  const res = await API.post("/auth/reset-password", data);
  return res.data;
};
