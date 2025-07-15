import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as UserActions from "./user.actions";
import * as UserSelectors from "./user.selectors";

@Injectable({
  providedIn: "root",
})
export class UserStateFacade {
  constructor(private store: Store) {}

  // Selectors
  name$: Observable<string> = this.store.select(UserSelectors.getName);
  email$: Observable<string> = this.store.select(UserSelectors.getEmail);
  isAdmin$: Observable<boolean> = this.store.select(UserSelectors.getIsAdmin);
  isLoading$: Observable<boolean> = this.store.select(UserSelectors.getIsLoading);
  error$: Observable<string | null> = this.store.select(UserSelectors.getError);

  // Actions
  getUser(): void {
    this.store.dispatch(UserActions.requestUser());
  }

  clearUser(): void {
    this.store.dispatch(UserActions.clearUser());
  }
}
