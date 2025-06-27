import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { customEmailValidator } from "@app/shared/directives/email.directive";

@Component({
  selector: "app-registration-form",
  templateUrl: "./registration-form.component.html",
  styleUrls: ["./registration-form.component.scss"],
})
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;
  // Use the names `name`, `email`, `password` for the form controls.

  isSubmitted: boolean = false;

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(6)]),
      email: new FormControl("", [Validators.required, customEmailValidator]),
      password: new FormControl("", Validators.required),
    });
  }

  onSubmit() {
    const form = this.registrationForm;

    this.registrationForm.markAllAsTouched;

    if (form.valid) {
      console.log(form.value);
    }

    console.log("Form submitted.");
  }
}
