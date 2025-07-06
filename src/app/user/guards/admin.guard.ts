import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";
import { UserStoreService } from "../services/user-store.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  private userStore = inject(UserStoreService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Null check hozzáadása
    if (!this.userStore.isAdmin$) {
      console.error("isAdmin$ is undefined in UserStoreService");
      return this.router.createUrlTree(["/courses"]);
    }

    return this.userStore.isAdmin$.pipe(
      map((isAdmin) => {
        console.log("AdminGuard - isAdmin:", isAdmin);
        if (isAdmin) {
          return true;
        } else {
          return this.router.createUrlTree(["/courses"]);
        }
      })
    );
  }
}
