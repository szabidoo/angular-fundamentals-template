import { inject, Injectable } from "@angular/core";
import { CanLoad, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthStateFacade } from "@app/store/auth/auth.facade";

@Injectable({
  providedIn: "root",
})
export class AuthorizedGuard implements CanLoad {
  private authFacade = inject(AuthStateFacade);
  private router = inject(Router);

  canLoad(): Observable<boolean | UrlTree> {
    return this.authFacade.isAuthorized$.pipe(
      tap((isAuthorized) => {
        console.log("AuthorizedGuard: isAuthorized =", isAuthorized);
      }),
      map((isAuthorized) => {
        if (isAuthorized) {
          console.log("AuthorizedGuard: User is authorized, allowing access");
          return true;
        } else {
          console.log("AuthorizedGuard: User not authorized, redirecting to login");
          return this.router.createUrlTree(["/login"]);
        }
      })
    );
  }
}
