import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, inject } from "@angular/core";
import { CoursesStoreService } from "@app/services/courses-store.service";

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

  private coursesStore = inject(CoursesStoreService);

  searchTerm: string = "";

  resetInput() {
    this.searchTerm = "";
    this.valueChange.emit(this.searchTerm);
  }

  onSubmit() {
    console.log("Search form submitted!");

    this.coursesStore.filterCourses(this.searchTerm).subscribe({
      next: (response) => {
        console.log("Search results: ", response);
      },
      error: (err) => console.error("Search error: ", err),
    });

    this.search.emit(this.searchTerm);
    this.resetInput();
  }
}
