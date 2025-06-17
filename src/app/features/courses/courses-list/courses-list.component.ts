import { Component, Input, Output } from "@angular/core";
import { ButtonComponent } from "@app/shared/components";

@Component({
  selector: "app-courses-list",
  templateUrl: "./courses-list.component.html",
  styleUrls: ["./courses-list.component.css"],
})
export class CoursesListComponent {
  @Input() courses!: string[];
  @Input() editable!: boolean;
  @Output() showCourse!: Event;
  @Output() editCourse!: ButtonComponent;
  @Output() deleteCourse!: ButtonComponent;
}
