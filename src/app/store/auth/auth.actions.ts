import { createAction, props } from "@ngrx/store";
import { LoginRequest, AuthResponse, RegisterRequest } from "@app/auth/models/auth.interface";

export const AuthConstants = {
  LOGIN: "[Auth] Login",
  LOGIN_SUCCESS: "[Auth] Login Success",
  LOGIN_FAIL: "[Auth] Login Fail",
  LOGOUT: "[Auth] Logout",
  LOGOUT_SUCCESS: "[Auth] Logout Success",
  LOGOUT_FAIL: "[Auth] Logout Fail",
  REGISTER: "[Auth] Register",
  REGISTER_SUCCESS: "[Auth] Register Success",
  REGISTER_FAIL: "[Auth] Register Fail",
  CHECK_AUTH: "[Auth] Check Auth",
  SET_AUTHORIZED: "[Auth] Set Authorized",
};

// Login Actions
export const login = createAction(AuthConstants.LOGIN, props<{ credentials: LoginRequest }>());
export const loginSuccess = createAction(AuthConstants.LOGIN_SUCCESS, props<{ response: AuthResponse }>());
export const loginFail = createAction(AuthConstants.LOGIN_FAIL, props<{ error: string }>());

// Logout Actions
export const logout = createAction(AuthConstants.LOGOUT);
export const logoutSuccess = createAction(AuthConstants.LOGOUT_SUCCESS);
export const logoutFail = createAction(AuthConstants.LOGOUT_FAIL, props<{ error: string }>());

// Register Actions
export const register = createAction(AuthConstants.REGISTER, props<{ user: RegisterRequest }>());
export const registerSuccess = createAction(AuthConstants.REGISTER_SUCCESS, props<{ response: AuthResponse }>());
export const registerFail = createAction(AuthConstants.REGISTER_FAIL, props<{ error: string }>());

// Other Actions
export const checkAuth = createAction(AuthConstants.CHECK_AUTH);
export const setAuthorized = createAction(AuthConstants.SET_AUTHORIZED, props<{ isAuthorized: boolean }>());
