import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStateFacade } from "@app/store/auth/auth.facade";
import { UserStateFacade } from "@app/store/user/user.facade";
import { LoginRequest } from "@app/auth/models/auth.interface";
import { filter, take } from "rxjs/operators";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent implements OnInit {
  // Template properties
  email = "";
  password = "";
  name = "";

  // Inject services first
  private authFacade = inject(AuthStateFacade);
  private userFacade = inject(UserStateFacade);
  private router = inject(Router);

  // Then use them in Observable definitions
  isLoading$ = this.authFacade.isLoading$;
  error$ = this.authFacade.error$;
  isAuthorized$ = this.authFacade.isAuthorized$;

  ngOnInit(): void {}
  onSubmit(): void {
    if (this.email && this.password) {
      const loginData: LoginRequest = {
        name: this.name,
        email: this.email,
        password: this.password,
      };

      console.log("Dispatching login action...", loginData);
      this.authFacade.login(loginData);
    }
  }
}
