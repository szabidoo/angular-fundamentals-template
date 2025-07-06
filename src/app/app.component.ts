import { Component, inject } from "@angular/core";
import { mockedCoursesList, mockedAuthorsList } from "src/app/shared/mocks/mocks";
import { Course } from "./shared/interfaces/course.interface";
import { AuthService } from "./auth/services/auth.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserStoreService } from "./user/services/user-store.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "courses-app";
  isLoggedIn = false;
  private router = inject(Router);
  private authService = inject(AuthService);
  private userStore = inject(UserStoreService);
  isAuthorized$: Observable<boolean> = this.authService.isAuthorized$;
  name$ = this.userStore.name$;

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        alert("Logged out.");
        console.log("Logout: ", response);
        this.router.navigate(["/login"]);
      },
    });
  }

  // onShowCourse(id: Course["id"]): void {
  //   console.log("Clicked on course:", id);
  // }

  // onEditCourse(id: Course["id"]): void {
  //   console.log("Editing course:", id);
  // }

  // onDeleteCourse(id: Course["id"]): void {
  //   console.log("Delete course:", id);
  // }

  // getAuthorNames(authors: Course["authors"]): Course["authors"] {
  //   return mockedAuthorsList.filter((author) => authors.includes(author.id)).map((author) => author.name);
  // }
}
