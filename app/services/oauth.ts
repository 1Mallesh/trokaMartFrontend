import { API } from "./api";

// Retrieve Google OAuth callback data after redirect from backend
export const getGoogleAuthCallback = async (code?: string) => {
  try {
    // Use the authorization code from query params if available
    if (code) {
      const res = await API.post("/auth/google/callback", { code });
      return res.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Get user data from token
export const getUserFromToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Initiate Google OAuth flow
export const initiateGoogleOAuth = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = "openid email profile";
  const responseType = "code";

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

  window.location.href = googleAuthUrl;
};

// Alternative: Redirect to your backend OAuth endpoint
export const redirectToBackendOAuth = () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  window.location.href = `${backendUrl}/auth/google`;
};
