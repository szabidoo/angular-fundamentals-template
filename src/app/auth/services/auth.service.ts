import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, debounceTime, Observable, of, switchMap, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { SessionStorageService } from "./session-storage.service";
import { LoginRequest, AuthResponse, RegisterRequest } from "../models/auth.interface";
import { Router } from "@angular/router";
import { UserStoreService } from "@app/user/services/user-store.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private sessionStorage = inject(SessionStorageService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private userStore = inject(UserStoreService);

  private isAuthorized$$ = new BehaviorSubject<boolean>(false);
  isAuthorized$ = this.isAuthorized$$.asObservable();
  private readonly API_BASE_URL = "http://localhost:4000";

  login(user: LoginRequest): Observable<AuthResponse> {
    // replace 'any' with the required interface
    // Add your code here
    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/login`, user).pipe(
      tap((response) => {
        if (response.successful && response.result) {
          this.sessionStorage.setToken(response.result);
          this.isAuthorized$$.next(true);

          return this.userStore.getUser().subscribe({
            next: (response) => {
              if (response.result) {
                console.log("Login response: ", response);
              }
            },
            error: (err) => {
              console.log(err);
            },
          });
        } else {
          return of(response);
        }
      }),
      catchError((error) => {
        console.error("Login failed: ", error), this.isAuthorized$$.next(false);
        throw error;
      })
    );
  }

  logout(): Observable<any> {
    // Add your code here
    const TOKEN = this.sessionStorage.getToken();
    return this.http
      .delete(`${this.API_BASE_URL}/logout`, {
        headers: { Authorization: `${TOKEN}` },
      })
      .pipe(
        tap(() => {
          this.sessionStorage.deleteToken();
          this.isAuthorized$$.next(false);
        }),
        catchError((err) => {
          console.log("Logout failed, but clearing token anyway: ", err);
          this.sessionStorage.deleteToken();
          this.isAuthorized$$.next(false);
          return of(null);
        })
      );
  }

  register(user: RegisterRequest): Observable<AuthResponse> {
    // replace 'any' with the required interface
    // Add your code here
    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/register`, user).pipe(
      tap((response) => {
        if (response.successful && response.result) {
          alert("Registration completed. You may log in now.");
          this.router.navigate(["/login"]);
        }
      }),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    );
  }

  get isAuthorised(): boolean {
    // Add your code here. Get isAuthorized$$ value
    return this.isAuthorized$$.value;
  }

  set isAuthorised(value: boolean) {
    // Add your code here. Change isAuthorized$$ value
    this.isAuthorized$$.next(value);
  }

  getLoginUrl() {
    // Add your code here
  }
}
