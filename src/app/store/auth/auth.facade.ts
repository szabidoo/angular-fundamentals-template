import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { LoginRequest, RegisterRequest } from "@app/auth/models/auth.interface";
import * as AuthActions from "./auth.actions";
import * as AuthSelectors from "./auth.selectors";

@Injectable({
  providedIn: "root",
})
export class AuthStateFacade {
  constructor(private store: Store) {}

  // Selectors
  isAuthorized$: Observable<boolean> = this.store.select(AuthSelectors.getIsAuthorized);
  isLoading$: Observable<boolean> = this.store.select(AuthSelectors.getIsLoading);
  error$: Observable<string | null> = this.store.select(AuthSelectors.getError);

  // Actions
  login(credentials: LoginRequest): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  register(user: RegisterRequest): void {
    this.store.dispatch(AuthActions.register({ user }));
  }

  checkAuth(): void {
    this.store.dispatch(AuthActions.checkAuth());
  }
}
