import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CoursesStoreService } from "@app/services/courses-store.service";
import { Course, CourseResponse } from "@app/shared/interfaces/course.interface";
import { mockedCoursesList, mockedAuthorsList } from "@app/shared/mocks/mocks";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent implements OnInit {
  private coursesStore = inject(CoursesStoreService);
  allCourses: Course[] = [];
  courses$ = this.coursesStore.courses$;

  private subscriptions: Observable<any>[] = [];

  ngOnInit(): void {
    this.coursesStore.getAll();
  }

  searchQuery: string = "";

  coursesList: Course[] = [...this.allCourses];

  // getAuthorNames(authors: Course["authors"]): Course["authors"] {
  //   return mockedAuthorsList.filter((author) => authors.includes(author.id)).map((author) => author.name);
  // }

  createCourse() {}

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
