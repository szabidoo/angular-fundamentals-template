import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { SessionStorageService } from "./session-storage.service";

interface LoginRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AuthResponse {
  successful: boolean;
  result: string;
  user?: {
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private sessionStorage = inject(SessionStorageService);
  private http = inject(HttpClient);

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
    return this.http.delete(`${this.API_BASE_URL}/logout`, { body: TOKEN }).pipe(
      tap(() => {
        this.sessionStorage.deleteToken();
        this.isAuthorized$$.next(false);
      }),
      catchError((err) => {
        this.sessionStorage.deleteToken();
        this.isAuthorized$$.next(false);
        throw err;
      })
    );
  }

  register(user: RegisterRequest): Observable<AuthResponse> {
    // replace 'any' with the required interface
    // Add your code here
    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/register`, user).pipe(
      tap((response) => {
        if (response.successful && response.result) {
          alert(response.result);
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
