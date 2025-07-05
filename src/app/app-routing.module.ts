import { RouterModule, Routes } from "@angular/router";
import { LoginFormComponent, RegistrationFormComponent } from "./shared/components";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";
import { AdminGuard } from "./user/guards/admin.guard";
import { CoursesComponent } from "./features/courses/courses.component";
import { AuthorizedGuard } from "./auth/guards/authorized.guard";
import { NotAuthorizedGuard } from "./auth/guards/not-authorized.guard";

export const routes: Routes = [
  /* Add your code here */
  {
    path: "login",
    canActivate: [NotAuthorizedGuard],
    component: LoginFormComponent,
  },
  {
    path: "registration",
    canActivate: [NotAuthorizedGuard],
    component: RegistrationFormComponent,
  },
  {
    path: "courses",
    canLoad: [AuthorizedGuard],
    loadChildren: () => import("./features/courses/courses.module").then((m) => m.CoursesModule),
  },

  { path: "", redirectTo: "/courses", pathMatch: "full" },
  { path: "**", redirectTo: "courses" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
