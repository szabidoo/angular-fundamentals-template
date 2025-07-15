import { inject, Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";
import { filter, take, switchMap } from "rxjs/operators";
import { UserStateFacade } from "@app/store/user/user.facade";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  private userFacade = inject(UserStateFacade);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.userFacade.isLoading$.pipe(
      filter((isLoading) => !isLoading),
      take(1),
      switchMap(() => this.userFacade.isAdmin$),
      take(1),
      map((isAdmin) => {
        console.log("AdminGuard - isAdmin after loading:", isAdmin);
        if (isAdmin) {
          return true;
        } else {
          console.log("AdminGuard - User is not admin, redirecting to courses");
          return this.router.createUrlTree(["/courses"]);
        }
      })
    );
  }
}
