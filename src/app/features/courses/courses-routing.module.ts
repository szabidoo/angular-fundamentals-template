import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoursesComponent } from "./courses.component";
import { AdminGuard } from "@app/user/guards/admin.guard";
const routes: Routes = [
  { path: "", component: CoursesComponent },
  {
    path: "add",
    canLoad: [AdminGuard],
    loadComponent: () => import("@shared/components/course-form/course.component").then((m) => m.CourseComponent),
  },
  {
    path: "edit/:id",
    canLoad: [AdminGuard],
    loadComponent: () => import("@shared/components/course-form/course.component").then((m) => m.CourseComponent),
  },
  {
    path: ":id",
    loadComponent: () => import("../course-info/course-info.component").then((m) => m.CourseInfoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
