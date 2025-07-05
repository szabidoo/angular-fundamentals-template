import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RegisterRequest } from "@app/auth/models/auth.interface";
import { AuthService } from "@app/auth/services/auth.service";
import { customEmailValidator } from "@app/shared/directives/email.directive";

@Component({
  selector: "app-registration-form",
  templateUrl: "./registration-form.component.html",
  styleUrls: ["./registration-form.component.scss"],
})
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;
  // Use the names `name`, `email`, `password` for the form controls.
  private router = inject(Router);
  private authService = inject(AuthService);
  isSubmitted: boolean = false;

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(6)]),
      email: new FormControl("", [Validators.required, customEmailValidator]),
      password: new FormControl("", Validators.required),
    });
  }

  register(user: RegisterRequest) {
    this.authService.register(user).subscribe({
      next: (response) => {
        console.log("Registration successful: ", response);
        if (response.successful) {
          this.router.navigate(["/login"]);
        }
      },
      error: (err) => {
        console.error(err);
        throw err;
      },
    });
  }

  onSubmit() {
    const form = this.registrationForm;

    this.registrationForm.markAllAsTouched();

    if (form.valid) {
      console.log(form.value);
    }

    this.register(form.value);
    console.log("Form submitted.");
  }
}
