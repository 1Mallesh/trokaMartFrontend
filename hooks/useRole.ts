import { useAuth } from "./useAuth";

export const useRole = () => {
  const { user } = useAuth();

  return {
    role: user?.role || null,
    isAdmin: user?.role === "admin",
    isSeller: user?.role === "seller",
    isBuyer: user?.role === "buyer",
  };
};