import { inject, Injectable, OnInit } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { catchError, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { SessionStorageService } from "../services/session-storage.service";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptor implements HttpInterceptor {
  // Add your code here
  private sessionStorage = inject(SessionStorageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.sessionStorage.getToken();

    let authReq = req;
    if (token) {
      authReq = req.clone({
        headers: req.headers.set("Authorization", token),
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout().subscribe({
            next: () => {
              this.router.navigate(["/login"]);
            },
            error: () => {
              this.router.navigate(["/login"]);
            },
          });
        }
        return throwError(() => error);
      })
    );
  }
}
