import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
}

// Helper to get initial state from localStorage safely
const getInitialState = (): AuthState => {
  try {
    const savedToken = localStorage.getItem("readysip_token");
    const savedUserStr = localStorage.getItem("readysip_user");

    if (savedToken && savedUserStr) {
      const savedUser = JSON.parse(savedUserStr) as User;
      return {
        user: savedUser,
        token: savedToken,
        isAdmin: savedUser.role === "admin",
      };
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
  }

  return {
    user: null,
    token: null,
    isAdmin: false,
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAdmin = user.role === "admin";

      localStorage.setItem("readysip_token", token);
      localStorage.setItem("readysip_user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAdmin = false;

      localStorage.removeItem("readysip_token");
      localStorage.removeItem("readysip_user");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
