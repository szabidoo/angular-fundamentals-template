import { createAction, props } from "@ngrx/store";
import { AuthorsConstants } from "./authors.constants";
import { Author } from "@app/shared/interfaces/author.interface";
// Actions for requesting all authors
export const requestAllAuthors = createAction(AuthorsConstants.REQUEST_ALL_AUTHORS);

export const requestAllAuthorsSuccess = createAction(
  AuthorsConstants.REQUEST_ALL_AUTHORS_SUCCESS,
  props<{ resAuthors: Author[] }>()
);

export const requestAllAuthorsFail = createAction(
  AuthorsConstants.REQUEST_ALL_AUTHORS_FAIL,
  props<{ error: string }>()
);

// Actions for requesting a single author
export const requestSingleAuthor = createAction(AuthorsConstants.REQUEST_SINGLE_AUTHOR, props<{ id: string }>());

export const requestSingleAuthorSuccess = createAction(
  AuthorsConstants.REQUEST_SINGLE_AUTHOR_SUCCESS,
  props<{ resAuthor: Author }>()
);

export const requestSingleAuthorFail = createAction(
  AuthorsConstants.REQUEST_SINGLE_AUTHOR_FAIL,
  props<{ error: string }>()
);

// Actions for creating an author
export const requestCreateAuthor = createAction(AuthorsConstants.REQUEST_CREATE_AUTHOR, props<{ name: string }>());

export const requestCreateAuthorSuccess = createAction(
  AuthorsConstants.REQUEST_CREATE_AUTHOR_SUCCESS,
  props<{ resAuthor: Author }>()
);

export const requestCreateAuthorFail = createAction(
  AuthorsConstants.REQUEST_CREATE_AUTHOR_FAIL,
  props<{ error: string }>()
);
