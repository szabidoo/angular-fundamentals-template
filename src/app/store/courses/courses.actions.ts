// @ts-nocheck
import { createAction, props } from "@ngrx/store";
import { Course, CreateCourse } from "@app/shared/interfaces/course.interface";
import { Author } from "@app/shared/interfaces/author.interface";
import { CoursesConstants } from "./courses.constants";

// Actions for request all Courses
export const requestAllCourses = createAction(CoursesConstants.REQUEST_ALL_COURSES);
export const requestAllCoursesSuccess = createAction(
  CoursesConstants.REQUEST_ALL_COURSES_SUCCESS,
  props<{ courses: Course[] }>()
);
export const requestAllCoursesFail = createAction(
  CoursesConstants.REQUEST_ALL_COURSES_FAIL,
  props<{ error: string }>()
);

// Actions for request individual course
export const requestSingleCourse = createAction(CoursesConstants.REQUEST_SINGLE_COURSE, props<{ id: string }>());
export const requestSingleCourseSuccess = createAction(
  CoursesConstants.REQUEST_SINGLE_COURSE_SUCCESS,
  props<{ course: Course }>()
);
export const requestSingleCourseFail = createAction(
  CoursesConstants.REQUEST_SINGLE_COURSE_FAIL,
  props<{ error: string }>()
);

// Actions for request filtered Courses
export const requestFilteredCourses = createAction(
  CoursesConstants.REQUEST_FILTERED_COURSES,
  props<{ title: string }>()
);
export const requestFilteredCoursesSuccess = createAction(
  CoursesConstants.REQUEST_FILTERED_COURSES_SUCCESS,
  props<{ courses: Course[] }>()
);
export const requestFilteredCoursesFail = createAction(
  CoursesConstants.REQUEST_FILTERED_COURSES_FAIL,
  props<{ error: string }>()
);

// Actions for delete course
export const requestDeleteCourse = createAction(CoursesConstants.REQUEST_DELETE_COURSE, props<{ id: string }>());
export const requestDeleteCourseSuccess = createAction(CoursesConstants.REQUEST_DELETE_COURSE_SUCCESS);
export const requestDeleteCourseFail = createAction(
  CoursesConstants.REQUEST_DELETE_COURSE_FAIL,
  props<{ error: string }>()
);

// Actions for edit course
export const requestEditCourse = createAction(
  CoursesConstants.REQUEST_EDIT_COURSE,
  props<{ id: string; course: CreateCourse }>()
);
export const requestEditCourseSuccess = createAction(
  CoursesConstants.REQUEST_EDIT_COURSE_SUCCESS,
  props<{ course: Course }>()
);
export const requestEditCourseFail = createAction(
  CoursesConstants.REQUEST_EDIT_COURSE_FAIL,
  props<{ error: string }>()
);

// Actions for create course
export const requestCreateCourse = createAction(
  CoursesConstants.REQUEST_CREATE_COURSE,
  props<{ course: CreateCourse }>()
);
export const requestCreateCourseSuccess = createAction(
  CoursesConstants.REQUEST_CREATE_COURSE_SUCCESS,
  props<{ course: Course }>()
);
export const requestCreateCourseFail = createAction(
  CoursesConstants.REQUEST_CREATE_COURSE_FAIL,
  props<{ error: string }>()
);

// Actions for All Authors
export const requestAllAuthors = createAction(CoursesConstants.REQUEST_ALL_AUTHORS);
export const requestAllAuthorsSuccess = createAction(
  CoursesConstants.REQUEST_ALL_AUTHORS_SUCCESS,
  props<{ authors: Author[] }>()
);
export const requestAllAuthorsFail = createAction(
  CoursesConstants.REQUEST_ALL_AUTHORS_FAIL,
  props<{ error: string }>()
);

export const requestSingleAuthor = createAction(CoursesConstants.REQUEST_AUTHOR_NAME);
export const requestSingleAuthorSuccess = createAction(
  CoursesConstants.REQUEST_SINGLE_AUTHOR_SUCCESS,
  props<{ author: Author }>()
);
export const requestSingleAuthorFail = createAction(
  CoursesConstants.REQUEST_SINGLE_AUTHOR_FAIL,
  props<{ error: string }>()
);

// Actions for Create Author
export const requestCreateAuthor = createAction(CoursesConstants.REQUEST_CREATE_AUTHOR, props<{ name: string }>());
export const requestCreateAuthorSuccess = createAction(
  CoursesConstants.REQUEST_CREATE_AUTHOR_SUCCESS,
  props<{ author: Author }>()
);
export const requestCreateAuthorFail = createAction(
  CoursesConstants.REQUEST_CREATE_AUTHOR_FAIL,
  props<{ error: string }>()
);
