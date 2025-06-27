import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ModalComponent } from "./components/modal/modal.component";
import {
  HeaderComponent,
  ButtonComponent,
  InfoComponent,
  SearchComponent,
  CourseCardComponent,
  LoginFormComponent,
  RegistrationFormComponent,
  CourseComponent,
} from "./components";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DurationPipe } from "./pipes/duration.pipe";
import { CustomDatePipe } from "./pipes/custom-date.pipe";
import { EmailValidatorDirective } from "@shared/directives/email.directive";
import { AttributeDirective } from "./directives/attribute.directive";

const components = [
  HeaderComponent,
  ButtonComponent,
  InfoComponent,
  SearchComponent,
  ModalComponent,
  CourseCardComponent,
  LoginFormComponent,
  RegistrationFormComponent,
  CourseComponent,
  DurationPipe,
  CustomDatePipe,
  EmailValidatorDirective,
  AttributeDirective,
  DurationPipe,
  CustomDatePipe,
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  exports: [components],
})
export class SharedModule {}
