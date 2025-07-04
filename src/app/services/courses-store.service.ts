import { inject, Injectable } from "@angular/core";
import {
  Course,
  CourseResponse,
  CreateCourse,
  EditCourse,
  SingleCourseResponse,
} from "@app/shared/interfaces/course.interface";
import { BehaviorSubject, catchError, finalize, tap, throwError } from "rxjs";
import { CoursesService } from "./courses.service";
import { Author, AuthorResponse, SingleAuthorResponse } from "@app/shared/interfaces/author.interface";

@Injectable({
  providedIn: "root",
})
export class CoursesStoreService {
  private isLoading$$ = new BehaviorSubject<boolean>(false);
  private courses$$ = new BehaviorSubject<Course[]>([]);
  private authors$$ = new BehaviorSubject<Author[]>([]);
  private coursesService = inject(CoursesService);

  get isLoading$() {
    return this.isLoading$$.asObservable();
  }

  get courses$() {
    return this.courses$$.asObservable();
  }

  get authors$() {
    return this.authors$$.asObservable();
  }

  getAll(): void {
    console.log("CoursesStoreService getAll() called");
    console.log("About to call coursesService.getAll()");

    this.coursesService.getAll().subscribe({
      next: (courses) => {
        console.log("HTTP response received:", courses);
        // Just pass the original courses with string author IDs
        this.courses$$.next(courses.result);

        // Optionally load author details if needed elsewhere
        courses.result.forEach((course) => {
          course.authors.forEach((authorId) => {
            console.log("Author id: ", authorId);
            this.getAuthorById(authorId).subscribe();
          });
        });
      },
      error: (error) => {
        console.error("HTTP error:", error);
      },
    });
  }

  createCourse(course: CreateCourse) {
    // replace 'any' with the required interface
    // Add your code here

    this.isLoading$$.next(true);

    return this.coursesService.createCourse(course).pipe(
      tap((response: SingleCourseResponse) => {
        if (response.successful && response.result) {
          this.courses$$.next([...this.courses$$.value, response.result]);
        }
      }),

      catchError((err) => {
        console.error(err);
        throw err;
      }),

      finalize(() => {
        this.isLoading$$.next(false);
      })
    );
  }

  getCourse(id: string) {
    // Add your code here
    this.isLoading$$.next(true);

    return this.coursesService.getCourse(id).pipe(
      catchError((err) => {
        console.error(err);
        throw err;
      }),

      finalize(() => this.isLoading$$.next(false))
    );
  }

  editCourse(id: string, course: EditCourse) {
    // replace 'any' with the required interface
    // Add your code here
    this.isLoading$$.next(true);

    return this.coursesService.editCourse(id, course).pipe(
      tap((response: SingleCourseResponse) => {
        if (response.successful && response.result) {
          const currentCourses = this.courses$$.value;
          const updatedCourse = currentCourses.map((course) => (course.id === id ? response.result : course));

          this.courses$$.next(updatedCourse);
        }
      }),

      catchError((err) => {
        console.error(err);
        throw err;
      }),

      finalize(() => this.isLoading$$.next(false))
    );
  }

  deleteCourse(id: string) {
    // Add your code here
    this.isLoading$$.next(true);

    return this.coursesService.deleteCourse(id).pipe(
      catchError((err) => {
        console.error(err);
        throw err;
      }),

      finalize(() => {
        this.isLoading$$.next(false);
      })
    );
  }

  filterCourses(value: string) {
    // Add your code here
    this.isLoading$$.next(true);

    return this.coursesService.filterCourses(value).pipe(
      tap((response: CourseResponse) => {
        if (response.successful && response.result) {
          this.courses$$.next(response.result);
        }
      }),

      catchError((err) => {
        console.error(err);
        throw err;
      }),

      finalize(() => {
        this.isLoading$$.next(false);
      })
    );
  }

  getAllAuthors() {
    // Add your code here
    this.isLoading$$.next(true);

    return this.coursesService.getAllAuthors().pipe(
      tap((response: AuthorResponse) => {
        if (response.successful && response.result) {
          this.authors$$.next(response.result);
        }
      }),

      catchError((err) => {
        console.error(err);
        throw err;
      }),
      finalize(() => this.isLoading$$.next(false))
    );
  }

  createAuthor(name: string) {
    // Add your code here
    this.isLoading$$.next(true);

    return this.coursesService.createAuthor(name).pipe(
      catchError((err) => {
        console.error(err);
        throw err;
      }),
      finalize(() => this.isLoading$$.next(false))
    );
  }

  getAuthorById(id: string) {
    // Add your code here
    this.isLoading$$.next(true);

    return this.coursesService.getAuthorById(id).pipe(
      tap((response: SingleAuthorResponse) => {
        if (response.successful && response.result) {
          return response.result;
        }
        return;
      }),
      catchError((err) => {
        console.error(err);
        throw err;
      }),
      finalize(() => this.isLoading$$.next(false))
    );
  }
}
