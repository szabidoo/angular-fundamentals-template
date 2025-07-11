import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, inject } from "@angular/core";
import { CoursesStateFacade } from "@app/store/courses/courses.facade";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent {
  // Use the name `placeholder` for the @Input.
  // Use the name `search` for the @Output.

  @Input() placeholder?: string;
  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  private coursesFacade = inject(CoursesStateFacade);

  searchTerm: string = "";

  resetInput() {
    this.searchTerm = "";
    this.valueChange.emit(this.searchTerm);
  }

  onSubmit() {
    console.log("Search form submitted!");

    if (this.searchTerm && this.searchTerm.trim()) {
      this.coursesFacade.getFilteredCourses(this.searchTerm.trim());
    } else {
      this.coursesFacade.getAllCourses();
    }

    this.search.emit(this.searchTerm);
    this.resetInput();
  }
}
