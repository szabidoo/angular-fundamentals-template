import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ButtonComponent } from "@app/shared/components";

@Component({
  selector: "app-courses-list",
  templateUrl: "./courses-list.component.html",
  styleUrls: ["./courses-list.component.scss"],
})
export class CoursesListComponent {
  @Input() courses!: string[];
  @Input() editable!: boolean;
  @Output() showCourse!: EventEmitter<any>;
  @Output() editCourse!: EventEmitter<any>;
  @Output() deleteCourse!: EventEmitter<any>;
}
