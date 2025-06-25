import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
  selector: "[emailValidator]",
  providers: [
    /*Add your code here*/
    {
      provide: NG_VALIDATORS,
      useExisting: EmailValidatorDirective,
      multi: true,
    },
  ],
})
export class EmailValidatorDirective implements Validator {
  // Add your code here

  validate(control: AbstractControl): ValidationErrors | null {
    return customEmailValidator(control);
  }
}

export function customEmailValidator(control: AbstractControl) {
  const email = control.value;

  if (!email) return null;

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const valid = emailPattern.test(email);

  return valid ? null : { email: true };
}
