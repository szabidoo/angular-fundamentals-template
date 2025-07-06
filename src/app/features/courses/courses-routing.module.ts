import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoursesComponent } from "./courses.component";
import { AdminGuard } from "@app/user/guards/admin.guard";
import { CourseComponent } from "@app/shared/components";
import { CourseInfoComponent } from "../course-info/course-info.component";

const routes: Routes = [
  { path: "", component: CoursesComponent },
  {
    path: "add",
    component: CourseComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "edit/:id",
    component: CourseComponent,
    canActivate: [AdminGuard],
  },
  {
    path: ":id",
    component: CourseInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
