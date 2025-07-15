import { createAction, props } from "@ngrx/store";
import { UserResponse } from "@app/shared/interfaces/user.interface";

export const UserConstants = {
  REQUEST_USER: "[User] Request User",
  REQUEST_USER_SUCCESS: "[User] Request User Success",
  REQUEST_USER_FAIL: "[User] Request User Fail",
  SET_USER: "[User] Set User",
  CLEAR_USER: "[User] Clear User",
};

export const requestUser = createAction(UserConstants.REQUEST_USER);
export const requestUserSuccess = createAction(
  UserConstants.REQUEST_USER_SUCCESS,
  props<{ user: UserResponse["result"] }>()
);
export const requestUserFail = createAction(UserConstants.REQUEST_USER_FAIL, props<{ error: string }>());

export const setUser = createAction(UserConstants.SET_USER, props<{ user: UserResponse["result"] }>());

export const clearUser = createAction(UserConstants.CLEAR_USER);
