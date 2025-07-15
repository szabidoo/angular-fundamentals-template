import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Course } from "@app/shared/interfaces/course.interface";
import { CoursesStateFacade } from "@app/store/courses/courses.facade";
import { UserStateFacade } from "@app/store/user/user.facade";
import { UserStoreService } from "@app/user/services/user-store.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent implements OnInit, OnDestroy {
  private coursesFacade = inject(CoursesStateFacade);
  private userFacade = inject(UserStateFacade);
  private userStore = inject(UserStoreService);
  private router = inject(Router);

  courses$ = this.coursesFacade.courses$;
  isLoading$ = this.coursesFacade.isAllCoursesLoading$;
  isEditable$ = this.userFacade.isAdmin$;

  private subscriptions = new Subscription();
  searchQuery: string = "";

  ngOnInit(): void {
    this.coursesFacade.getAllCourses();

    this.userStore.isAdmin$.subscribe((isadmin) => {
      console.log("Is admin: ", isadmin);
    });

    this.userStore.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  createCourse(): void {
    this.router.navigate(["/courses/add"]);
  }

  onShowCourse(id: Course["id"]): void {
    this.router.navigate(["/courses", id]);
  }

  onEditCourse(id: Course["id"]): void {
    this.router.navigate(["/courses/edit", id]);
  }

  onDeleteCourse(id: Course["id"]): void {
    if (confirm("Are you sure you want to delete this course?")) {
      this.coursesFacade.deleteCourse(id);
      // Refresh courses after deletion
      setTimeout(() => {
        this.coursesFacade.getAllCourses();
      }, 500);
    }
  }

  onSearch(searchQuery: string) {
    console.log("Searching for: ", searchQuery);

    if (searchQuery && searchQuery.trim()) {
      this.coursesFacade.getFilteredCourses(searchQuery.trim());
    } else {
      this.coursesFacade.getAllCourses();
    }
  }
}
