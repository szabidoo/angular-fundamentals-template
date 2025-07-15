import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import * as AuthorsActions from "./authors.actions";
import { Author } from "@app/shared/interfaces/author.interface";
interface ApiResponse<T> {
  successful: boolean;
  result: T;
}

@Injectable()
export class AuthorsEffects {
  private readonly BASE_URL = "http://localhost:4000";

  constructor(private actions$: Actions, private http: HttpClient) {}

  // Load all authors
  getAllAuthors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthorsActions.requestAllAuthors),
      switchMap(() =>
        this.http.get<ApiResponse<Author[]>>(`${this.BASE_URL}/authors/all`).pipe(
          map((response) => AuthorsActions.requestAllAuthorsSuccess({ resAuthors: response.result })),
          catchError((error) => of(AuthorsActions.requestAllAuthorsFail({ error })))
        )
      )
    )
  );

  // Load a single author
  getSingleAuthor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthorsActions.requestSingleAuthor),
      switchMap((action) =>
        this.http.get<ApiResponse<Author>>(`${this.BASE_URL}/authors/${action.id}`).pipe(
          map((response) => AuthorsActions.requestSingleAuthorSuccess({ resAuthor: response.result })),
          catchError((error) => of(AuthorsActions.requestSingleAuthorFail({ error })))
        )
      )
    )
  );

  // Create a new author
  createAuthor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthorsActions.requestCreateAuthor),
      mergeMap((action) =>
        this.http.post<ApiResponse<Author>>(`${this.BASE_URL}/authors/add`, { name: action.name }).pipe(
          map((response) => AuthorsActions.requestCreateAuthorSuccess({ resAuthor: response.result })),
          catchError((error) => of(AuthorsActions.requestCreateAuthorFail({ error })))
        )
      )
    )
  );
}
