import { RouterModule, Routes } from "@angular/router";
import { LoginFormComponent, RegistrationFormComponent } from "./shared/components";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";

export const routes: Routes = [
  /* Add your code here */
  {
    path: "login",
    loadComponent: () =>
      import("./shared/components/login-form/login-form.component").then((m) => m.LoginFormComponent),
  },
  {
    path: "registration",
    loadComponent: () =>
      import("./shared/components/registration-form/registration-form.component").then(
        (m) => m.RegistrationFormComponent
      ),
  },
  {
    path: "courses",
    loadComponent: () => import("./features/courses/courses.component").then((m) => m.CoursesComponent),
  },
  {
    path: "courses/add",
    loadComponent: () => import("./shared/components/course-form/course.component").then((m) => m.CourseComponent),
  },
  {
    path: "courses/:id",
    loadComponent: () => import("./shared/components/course-form/course.component").then((m) => m.CourseComponent),
  },
  {
    path: "courses/edit/:id",
    loadComponent: () => import("./shared/components/course-form/course.component").then((m) => m.CourseComponent),
  },
  { path: "", redirectTo: "courses", pathMatch: "full" },
  { path: "**", redirectTo: "courses" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
