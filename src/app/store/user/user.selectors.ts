import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.reducer";

export const getUserState = createFeatureSelector<UserState>("user");

export const getName = createSelector(getUserState, (state) => state.name);

export const getEmail = createSelector(getUserState, (state) => state.email);

export const getIsAdmin = createSelector(getUserState, (state) => state.isAdmin);

export const getIsLoading = createSelector(getUserState, (state) => state.isLoading);

export const getError = createSelector(getUserState, (state) => state.error);
