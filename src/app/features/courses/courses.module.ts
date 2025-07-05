import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoursesComponent } from "./courses.component";
import { SharedModule } from "@app/shared/shared.module";
import { FormsModule } from "@angular/forms";
import { CoursesListComponent } from "./courses-list/courses-list.component";
import { CoursesListModule } from "./courses-list/courses-list.module";
import { CoursesRoutingModule } from "./courses-routing.module";

@NgModule({
  declarations: [CoursesComponent],
  imports: [CommonModule, SharedModule, FormsModule, CoursesListModule, CoursesRoutingModule],
  exports: [CoursesComponent],
})
export class CoursesModule {}
