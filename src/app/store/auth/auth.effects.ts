import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, tap } from "rxjs/operators";
import { AuthService } from "@app/auth/services/auth.service";
import { SessionStorageService } from "@app/auth/services/session-storage.service";
import * as AuthActions from "./auth.actions";
import * as UserActions from "../user/user.actions";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(({ credentials }) => console.log("Auth Effect: Login action received", credentials)),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => {
            console.log("Auth Effect: Login response", response);
            if (response.successful && response.result) {
              this.sessionStorage.setToken(response.result);
              return AuthActions.loginSuccess({ response });
            }
            return AuthActions.loginFail({ error: "Login failed" });
          }),
          catchError((error) => {
            console.error("Auth Effect: Login error", error);
            return of(AuthActions.loginFail({ error: error.message }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        console.log("Auth Effect: Login success, navigating to courses...");
        this.router.navigate(["/courses"]);
      }),
      map(() => UserActions.requestUser())
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => console.log("Auth Effect: logout action received")),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => {
            console.log("Auth Effect: logout successful, clearing token");
            this.sessionStorage.deleteToken();
            return AuthActions.logoutSuccess();
          }),
          catchError((error) => {
            console.error("Auth Effect: logout error", error);
            this.sessionStorage.deleteToken();
            return of(AuthActions.logoutSuccess());
          })
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          console.log("Auth Effect: Logout success, navigating to login");
          this.router.navigate(["/login"]).then(
            (success) => console.log("Logout navigation success:", success),
            (error) => console.error("Logout navigation error:", error)
          );
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ user }) =>
        this.authService.register(user).pipe(
          map((response) => AuthActions.registerSuccess({ response })),
          catchError((error) => of(AuthActions.registerFail({ error: error.message })))
        )
      )
    )
  );

  setAuthorizedSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setAuthorized),
      filter(({ isAuthorized }) => isAuthorized === true),
      tap(() => console.log("Auth Effect: setAuthorized true, loading user data")),
      map(() => UserActions.requestUser())
    )
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      tap(() => console.log("Auth Effect: checkAuth action received")),
      map(() => {
        const token = this.sessionStorage.getToken();
        const isAuthorized = !!token;
        console.log("Auth Effect: checkAuth result", { token: !!token, isAuthorized });
        return AuthActions.setAuthorized({ isAuthorized });
      })
    )
  );
}
