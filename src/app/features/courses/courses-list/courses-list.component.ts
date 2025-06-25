import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Course } from "@app/shared/interfaces/course.interface";

@Component({
  selector: "app-courses-list",
  templateUrl: "./courses-list.component.html",
  styleUrls: ["./courses-list.component.scss"],
})
export class CoursesListComponent {
  @Input() courses: Course[] = [];
  @Input() editable: boolean = false;

  @Output() showCourse = new EventEmitter<string>();
  @Output() editCourse = new EventEmitter<string>();
  @Output() deleteCourse = new EventEmitter<string>();

  onShow(id: Course["id"]) {
    this.showCourse.emit(id);
  }

  onEdit(id: Course["id"]) {
    this.editCourse.emit(id);
  }

  onDelete(id: Course["id"]) {
    this.deleteCourse.emit(id);
  }
}
