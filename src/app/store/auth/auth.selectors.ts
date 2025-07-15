import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

export const getAuthState = createFeatureSelector<AuthState>("auth");

export const getIsAuthorized = createSelector(getAuthState, (state) => state.isAuthorized);

export const getIsLoading = createSelector(getAuthState, (state) => state.isLoading);

export const getError = createSelector(getAuthState, (state) => state.error);
