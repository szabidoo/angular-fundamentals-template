import { Component } from "@angular/core";
import { mockedCoursesList, mockedAuthorsList } from "src/app/shared/mocks/mocks";
import { Course } from "./shared/interfaces/course.interface";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "courses-app";
  isLoggedIn = false;

  testCourse: Course = {
    id: mockedCoursesList[1].id,
    title: mockedCoursesList[1].title,
    description: mockedCoursesList[1].description,
    creationDate: new Date(mockedCoursesList[1].creationDate),
    duration: mockedCoursesList[1].duration,
    authors: this.getAuthorNames(mockedCoursesList[1].authors),
    editable: true,
  };

  coursesList: Course[] = (() => {
    return mockedCoursesList.map((course) => ({
      ...course,
      creationDate: new Date(course.creationDate),
      authors: this.getAuthorNames(course.authors),
      editable: true,
    }));
  })();

  onSearch(searchQuery: string) {
    console.log("Searching for: ", searchQuery);
  }

  toggleLogin(): void {
    this.isLoggedIn = !this.isLoggedIn;
  }

  onShowCourse(id: Course["id"]): void {
    console.log("Clicked on course:", id);
  }

  onEditCourse(id: Course["id"]): void {
    console.log("Editing course:", id);
  }

  onDeleteCourse(id: Course["id"]): void {
    console.log("Delete course:", id);
  }

  getAuthorNames(authors: Course["authors"]): Course["authors"] {
    return mockedAuthorsList.filter((author) => authors.includes(author.id)).map((author) => author.name);
  }
}
