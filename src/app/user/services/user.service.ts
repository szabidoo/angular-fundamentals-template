import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserResponse } from "@app/shared/interfaces/user.interface";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly USER_API_URL = "http://localhost:4000/users/me";
  private http = inject(HttpClient);

  getUser() {
    // Add your code here
    return this.http.get<UserResponse>(`${this.USER_API_URL}`);
  }
}
