// @ts-nocheck
import { Action, createReducer, on } from "@ngrx/store";
import { Course } from "@app/shared/interfaces/course.interface";
import { Author } from "@app/shared/interfaces/author.interface";
import * as CoursesActions from "./courses.actions";

export const coursesFeatureKey = "courses";

export interface CoursesState {
  allCourses: Course[] | null;
  course: Course | null;
  isAllCoursesLoading: boolean;
  isSingleCourseLoading: boolean;
  isSearchState: boolean;
  errorMessage: string;
  authors: Author[];
  authorsLoading: boolean;
}

export const initialState: CoursesState = {
  allCourses: null,
  course: null,
  isAllCoursesLoading: false,
  isSingleCourseLoading: false,
  isSearchState: false,
  errorMessage: "",
  authors: [],
  authorsLoading: false,
};

export const coursesReducer = createReducer(
  initialState,

  // Request all courses
  on(CoursesActions.requestAllCourses, (state) => ({
    ...state,
    isAllCoursesLoading: true,
    errorMessage: "",
  })),
  on(CoursesActions.requestAllCoursesSuccess, (state, { courses }) => ({
    ...state,
    allCourses: courses,
    isAllCoursesLoading: false,
    isSearchState: false,
    errorMessage: "",
  })),
  on(CoursesActions.requestAllCoursesFail, (state, { error }) => ({
    ...state,
    isAllCoursesLoading: false,
    errorMessage: error,
  })),

  // Request single course
  on(CoursesActions.requestSingleCourse, (state) => ({
    ...state,
    isSingleCourseLoading: true,
    errorMessage: "",
  })),
  on(CoursesActions.requestSingleCourseSuccess, (state, { course }) => ({
    ...state,
    course: course,
    isSingleCourseLoading: false,
    errorMessage: "",
  })),
  on(CoursesActions.requestSingleCourseFail, (state, { error }) => ({
    ...state,
    isSingleCourseLoading: false,
    errorMessage: error,
  })),

  // Request filtered courses
  on(CoursesActions.requestFilteredCourses, (state) => ({
    ...state,
    isAllCoursesLoading: true,
    isSearchState: true,
    errorMessage: "",
  })),
  on(CoursesActions.requestFilteredCoursesSuccess, (state, { courses }) => ({
    ...state,
    allCourses: courses,
    isAllCoursesLoading: false,
    isSearchState: true,
    errorMessage: "",
  })),
  on(CoursesActions.requestFilteredCoursesFail, (state, { error }) => ({
    ...state,
    isAllCoursesLoading: false,
    errorMessage: error,
  })),

  // Delete course
  on(CoursesActions.requestDeleteCourse, (state) => ({
    ...state,
    errorMessage: "",
  })),
  on(CoursesActions.requestDeleteCourseSuccess, (state) => ({
    ...state,
    errorMessage: "",
  })),
  on(CoursesActions.requestDeleteCourseFail, (state, { error }) => ({
    ...state,
    errorMessage: error,
  })),

  // Edit course
  on(CoursesActions.requestEditCourse, (state) => ({
    ...state,
    errorMessage: "",
  })),
  on(CoursesActions.requestEditCourseSuccess, (state, { course }) => ({
    ...state,
    course: course,
    allCourses: state.allCourses ? state.allCourses.map((c) => (c.id === course.id ? course : c)) : null,
    errorMessage: "",
  })),
  on(CoursesActions.requestEditCourseFail, (state, { error }) => ({
    ...state,
    errorMessage: error,
  })),

  // Create course
  on(CoursesActions.requestCreateCourse, (state) => ({
    ...state,
    errorMessage: "",
  })),
  on(CoursesActions.requestCreateCourseSuccess, (state, { course }) => ({
    ...state,
    allCourses: state.allCourses ? [...state.allCourses, course] : [course],
    errorMessage: "",
  })),
  on(CoursesActions.requestCreateCourseFail, (state, { error }) => ({
    ...state,
    errorMessage: error,
  })),

  // All Authors
  on(CoursesActions.requestAllAuthors, (state) => ({
    ...state,
    authorsLoading: true,
  })),
  on(CoursesActions.requestAllAuthorsSuccess, (state, { authors }) => ({
    ...state,
    authors,
    authorsLoading: false,
  })),
  on(CoursesActions.requestAllAuthorsFail, (state) => ({
    ...state,
    authorsLoading: false,
  })),

  // Single Author
  on(CoursesActions.requestSingleAuthor, (state) => ({
    ...state,
    isSingleAuthorLoading: true,
    errorMessage: "",
  })),
  on(CoursesActions.requestSingleAuthorSuccess, (state, { author }) => ({
    ...state,
    author,
    isSingleAuthorLoading: false,
    errorMessage: "",
  })),
  on(CoursesActions.requestSingleAuthorFail, (state, { error }) => ({
    ...state,
    isSingleAuthorLoading: false,
    errorMessage: error,
  })),

  // Create Author
  on(CoursesActions.requestCreateAuthor, (state) => ({
    ...state,
    authorsLoading: true, // Jelzi a folyamatot
  })),
  on(CoursesActions.requestCreateAuthorSuccess, (state, { author }) => ({
    ...state,
    authors: [...state.authors, author], // Hozzáadja az új authort a listához
    authorsLoading: false,
  }))
);

export const reducer = (state: CoursesState, action: Action): CoursesState => coursesReducer(state, action);
