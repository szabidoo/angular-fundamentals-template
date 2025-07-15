import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";

export interface AuthState {
  isAuthorized: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  isAuthorized: false,
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => {
    console.log("Auth Reducer: Login action");
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }),

  on(AuthActions.loginSuccess, (state, { response }) => {
    console.log("Auth Reducer: Login success");
    return {
      ...state,
      isAuthorized: true,
      isLoading: false,
      error: null,
    };
  }),

  on(AuthActions.loginFail, (state, { error }) => {
    console.log("Auth Reducer: Login fail", error);
    return {
      ...state,
      isAuthorized: false,
      isLoading: false,
      error,
    };
  }),

  on(AuthActions.setAuthorized, (state, { isAuthorized }) => {
    console.log("Auth Reducer: Set authorized", isAuthorized);
    return {
      ...state,
      isAuthorized,
    };
  }),

  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.logoutSuccess, (state) => {
    console.log("Auth Reducer: Logout success, setting isAuthorized to FALSE");
    return {
      ...state,
      isAuthorized: false,
      isLoading: false,
      error: null,
    };
  }),

  on(AuthActions.logoutFail, (state, { error }) => ({
    ...state,
    isAuthorized: false,
    isLoading: false,
    error,
  }))
);
