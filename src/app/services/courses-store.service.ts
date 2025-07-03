import { inject, Injectable } from "@angular/core";
import {
  APICourse,
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
  private courses$$ = new BehaviorSubject<APICourse[]>([]);
  private authors$$ = new BehaviorSubject<Author[]>([]);
  private coursesSerive = inject(CoursesService);

  get isLoading$() {
    return this.isLoading$$.asObservable();
  }

  get courses$() {
    return this.courses$$.asObservable();
  }

  get authors$() {
    return this.authors$$.asObservable();
  }

  getAll() {
    // Add your code here
    this.isLoading$$.next(true);

    return this.coursesSerive.getAll().pipe(
      tap((response: CourseResponse) => {
        this.courses$$.next(response.result);
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

  createCourse(course: CreateCourse) {
    // replace 'any' with the required interface
    // Add your code here

    this.isLoading$$.next(true);

    return this.coursesSerive.createCourse(course).pipe(
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

    return this.coursesSerive.getCourse(id).pipe(
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

    return this.coursesSerive.editCourse(id, course).pipe(
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

    return this.coursesSerive.deleteCourse(id).pipe(
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

    return this.coursesSerive.filterCourses(value).pipe(
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

    return this.coursesSerive.getAllAuthors().pipe(
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

    return this.coursesSerive.createAuthor(name).pipe(
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

    return this.coursesSerive.getAuthorById(id).pipe(
      tap((response: SingleAuthorResponse) => {
        if (response.successful && response.result) {
          return response.result;
        }
      }),
      catchError((err) => {
        console.error(err);
        throw err;
      }),
      finalize(() => this.isLoading$$.next(false))
    );
  }
}
