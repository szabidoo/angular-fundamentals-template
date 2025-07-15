import { createReducer, on } from "@ngrx/store";
import * as UserActions from "./user.actions";

export interface UserState {
  name: string;
  email: string;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  name: "",
  email: "",
  isAdmin: false,
  isLoading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,

  on(UserActions.requestUser, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(UserActions.requestUserSuccess, (state, { user }) => {
    console.log("User Reducer: requestUserSuccess", user);
    return {
      ...state,
      name: user?.name || user?.email || "",
      email: user?.email || "",
      isAdmin: user?.role === "admin",
      isLoading: false, // Fontos: állítsd false-ra
      error: null,
    };
  }),

  on(UserActions.requestUserFail, (state, { error }) => ({
    ...state,
    isLoading: false, // Hiba esetén is állítsd false-ra
    error,
  })),

  on(UserActions.setUser, (state, { user }) => ({
    ...state,
    name: user?.name || user?.email || "",
    email: user?.email || "",
    isAdmin: user?.role === "admin",
  })),

  on(UserActions.clearUser, () => initialState)
);
