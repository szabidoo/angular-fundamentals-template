// @ts-nocheck
// Add your code here
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { coursesFeatureKey, CoursesState } from "./courses.reducer";

// Select the courses feature state
export const selectCoursesState = createFeatureSelector<CoursesState>(coursesFeatureKey);

// Selectors for loading states
export const isAllCoursesLoadingSelector = createSelector(
  selectCoursesState,
  (state: CoursesState) => state.isAllCoursesLoading
);

export const isSearchingStateSelector = createSelector(
  selectCoursesState,
  (state: CoursesState) => state.isSearchState
);

export const isSingleCourseLoadingSelector = createSelector(
  selectCoursesState,
  (state: CoursesState) => state.isSingleCourseLoading
);

// Selector for getting all courses
export const getAllCourses = createSelector(selectCoursesState, (state: CoursesState) => state.allCourses);

// Selector for getting a specific course
export const getCourse = createSelector(selectCoursesState, (state: CoursesState) => state.course);

// Selector for getting the error message
export const getErrorMessage = createSelector(selectCoursesState, (state: CoursesState) => state.errorMessage);
