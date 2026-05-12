import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContextStore";
import {
  loginUser,
  registerUser,
  resendVerificationEmail,
  verifyEmailToken,
} from "../services/api";

const TOKEN_KEY = "codeinsight_token";
const USER_KEY = "codeinsight_user";

const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(getStoredUser);

  const persistSession = useCallback((authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const login = useCallback(async (credentials) => {
    const authData = await loginUser(credentials);
    persistSession(authData);
    return authData;
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    const authData = await registerUser(payload);
    persistSession(authData);
    return authData;
  }, [persistSession]);

  const verifyEmail = useCallback(async (tokenToVerify) => {
    const authData = await verifyEmailToken(tokenToVerify);
    persistSession(authData);
    return authData;
  }, [persistSession]);

  const updateUser = useCallback((updates) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const nextUser = {
        ...currentUser,
        ...updates,
      };

      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  const resendVerification = useCallback(async () => {
    const response = await resendVerificationEmail();

    if (response.user) {
      updateUser(response.user);
    }

    return response;
  }, [updateUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      resendVerification,
      logout,
      updateUser,
      verifyEmail,
      isAuthenticated: Boolean(token),
    }),
    [
      login,
      logout,
      register,
      resendVerification,
      token,
      updateUser,
      user,
      verifyEmail,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
