import { Component, ViewChild } from "@angular/core";
import { Course } from "@app/shared/interfaces/course.interface";
import { mockedCoursesList, mockedAuthorsList } from "@app/shared/mocks/mocks";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent {
  private allCourses: Course[] = (() => {
    return mockedCoursesList.map((course) => ({
      ...course,
      creationDate: new Date(course.creationDate),
      authors: this.getAuthorNames(course.authors),
      editable: true,
    }));
  })();

  searchQuery: string = "";

  coursesList: Course[] = [...this.allCourses];

  getAuthorNames(authors: Course["authors"]): Course["authors"] {
    return mockedAuthorsList.filter((author) => authors.includes(author.id)).map((author) => author.name);
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

  onSearch(searchTerm: string) {
    console.log("Searching for: ", searchTerm);

    if (!searchTerm || searchTerm.trim() === "") {
      this.coursesList = [...this.allCourses];
    } else {
      this.coursesList = this.allCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.authors.some((author) => author.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      this.searchQuery = "";
    }
  }
}
