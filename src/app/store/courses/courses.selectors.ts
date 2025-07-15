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

export const getAllAuthors = createSelector(selectCoursesState, (state) => state.authors);
export const getAuthorsLoading = createSelector(selectCoursesState, (state) => state.authorsLoading);

// Selector for getting a single author by ID
export const getSingleAuthor = (authorId: string) =>
  createSelector(selectCoursesState, (state: CoursesState) => {
    return state.authors.find((author) => author.id === authorId) || null;
  });
