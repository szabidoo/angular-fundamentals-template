import { Component, inject, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginRequest } from "@app/auth/models/auth.interface";
import { AuthService } from "@app/auth/services/auth.service";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent {
  @ViewChild("loginForm") public loginForm!: NgForm;
  //Use the names `email` and `password` for form controls.
  private authService = inject(AuthService);
  private router = inject(Router);
  email!: string;
  password!: string;

  login(user: LoginRequest) {
    this.authService.login(user).subscribe({
      next: (response) => {
        if (response.successful) {
          console.log("Login successful: ", response);
          this.router.navigate(["/courses"]);
        }
      },
    });
  }

  onSubmit(form: NgForm) {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });
    this.login(form.value);
  }
}
