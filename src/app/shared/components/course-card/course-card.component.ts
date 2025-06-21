import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-course-card",
  templateUrl: "./course-card.component.html",
  styleUrls: ["./course-card.component.scss"],
})
export class CourseCardComponent {
  @Input() isEditable!: boolean;
  @Output() clickOnShow!: EventEmitter<any>;
  title!: string;
  description!: string;
  creationDate!: Date;
  duration!: number;
  authors!: string[];
}
