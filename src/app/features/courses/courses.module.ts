import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoursesComponent } from "./courses.component";
import { SharedModule } from "@app/shared/shared.module";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [CoursesComponent],
  imports: [CommonModule, SharedModule, FormsModule],
})
export class CoursesModule {}
