import { RouterModule, Routes } from "@angular/router";
import { LoginFormComponent, RegistrationFormComponent } from "./shared/components";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";
import { AdminGuard } from "./user/guards/admin.guard";
import { CoursesComponent } from "./features/courses/courses.component";

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
    path: "courses/add",
    canActivate: [AdminGuard],
    loadComponent: () => import("./shared/components/course-form/course.component").then((m) => m.CourseComponent),
  },
  {
    path: "courses/edit/:id",
    canActivate: [AdminGuard],
    loadComponent: () => import("./shared/components/course-form/course.component").then((m) => m.CourseComponent),
  },
  {
    path: "courses/:id",
    loadComponent: () => import("./shared/components/course-form/course.component").then((m) => m.CourseComponent),
  },
  {
    path: "courses",
    component: CoursesComponent,
  },
  { path: "", redirectTo: "/courses", pathMatch: "full" },
  { path: "**", redirectTo: "courses" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
