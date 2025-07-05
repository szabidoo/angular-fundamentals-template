import { inject, Injectable } from "@angular/core";
import { CanLoad, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthorizedGuard implements CanLoad {
  // Add your code here
  private authService = inject(AuthService);
  private isAuthorized = this.authService.isAuthorised;
  private router = inject(Router);

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized ? true : this.router.createUrlTree(["/login"]);
  }
}
