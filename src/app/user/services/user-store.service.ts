import { inject, Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { UserResponse } from "@app/shared/interfaces/user.interface";

@Injectable({
  providedIn: "root",
})
export class UserStoreService {
  private isAdmin$$ = new BehaviorSubject<boolean>(false);
  private name$$ = new BehaviorSubject<string>("");

  public isAdmin$ = this.isAdmin$$.asObservable();
  public name$ = this.name$$.asObservable();

  private userSerice = inject(UserService);

  getUser() {
    // Add your code here
    return this.userSerice.getUser().pipe(
      tap((response: UserResponse) => {
        if (response.successful && response.result) {
          if (response.result.name) {
            this.name$$.next(response.result.name);
          }

          this.isAdmin = response.result.role === "admin";
        }
      }),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    );
  }

  set isAdmin(value: boolean) {
    // Add your code here. Change isAdmin$$ value
    this.isAdmin$$.next(value);
  }
}
