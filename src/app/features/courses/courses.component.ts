import { Component } from "@angular/core";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent {
  onSearch(searchTerm: string) {
    console.log("Searching for: ", searchTerm);
  }
}
