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
  private authService = inject(AuthService);
  private router = inject(Router);

  email!: string;
  password!: string;
  isLoading = false; // Loading state hozzáadása

  login(user: LoginRequest) {
    this.isLoading = true;

    this.authService.login(user).subscribe({
      next: (response) => {
        if (response.successful) {
          console.log("Login successful: ", response);

          setTimeout(() => {
            this.router.navigate(["/courses"]);
            this.isLoading = false;
          }, 500);
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error("Login error:", error);
        this.isLoading = false;
      },
    });
  }

  onSubmit(form: NgForm) {
    if (this.isLoading) return; // Megakadályozza a dupla submit-et

    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (form.valid) {
      this.login(form.value);
    }
  }
}
