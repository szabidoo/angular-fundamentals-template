import { ActionReducerMap } from "@ngrx/store";
import { authReducer, AuthState } from "./auth/auth.reducer";
import { userReducer, UserState } from "./user/user.reducer";
import { coursesReducer, CoursesState } from "./courses/courses.reducer";
import { AuthEffects } from "./auth/auth.effects";
import { UserEffects } from "./user/user.effects";
import { CoursesEffects } from "./courses/courses.effects";

export interface State {
  auth: AuthState;
  user: UserState;
  courses: CoursesState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  user: userReducer,
  courses: coursesReducer,
};

export const effects = [AuthEffects, UserEffects, CoursesEffects];
