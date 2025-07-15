import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Course } from "@app/shared/interfaces/course.interface";

@Component({
  selector: "app-course-card",
  templateUrl: "./course-card.component.html",
  styleUrls: ["./course-card.component.scss"],
})
export class CourseCardComponent implements OnInit {
  @Input() course!: Course;
  @Input() editable!: boolean;

  @Output() clickOnShow = new EventEmitter<void>();

  ngOnInit(): void {
    console.log("CourseCardComponent initialized with course:", this.course);
    console.log("Course creationDate:", this.course.creationDate);
  }
}
