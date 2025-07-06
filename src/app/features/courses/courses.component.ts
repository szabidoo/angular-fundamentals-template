import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CoursesStoreService } from "@app/services/courses-store.service";
import { Course } from "@app/shared/interfaces/course.interface";
import { UserStoreService } from "@app/user/services/user-store.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent implements OnInit, OnDestroy {
  private coursesStore = inject(CoursesStoreService);
  private userStore = inject(UserStoreService);
  private router = inject(Router);

  courses$ = this.coursesStore.courses$;
  isLoading$ = this.coursesStore.isLoading$;
  isEditable = this.userStore.isAdmin$;

  private subscriptions = new Subscription();
  searchQuery: string = "";

  ngOnInit(): void {
    this.coursesStore.getAll();

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
      const deleteSubscription = this.coursesStore.deleteCourse(id).subscribe({
        next: () => {
          console.log("Course deleted successfully");
          this.coursesStore.getAll(); // Refresh the courses list
        },
        error: (error) => {
          console.error("Error deleting course:", error);
        },
      });
      this.subscriptions.add(deleteSubscription);
    }
  }

  onSearch(searchQuery: string) {
    console.log("Searching for: ", searchQuery);

    if (searchQuery && searchQuery.trim()) {
      this.coursesStore.filterCourses(searchQuery.trim());
    } else {
      this.coursesStore.getAll();
    }
  }
}
