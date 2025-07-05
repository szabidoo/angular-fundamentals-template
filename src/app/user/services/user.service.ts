import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserResponse } from "@app/shared/interfaces/user.interface";
import { catchError, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly USER_API_URL = "http://localhost:4000/users/me";
  private http = inject(HttpClient);

  getUser() {
    // Add your code here
    return this.http.get<UserResponse>(`${this.USER_API_URL}`).pipe(
      tap((response) => console.log("UserService response: ", response)),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    );
  }
}
