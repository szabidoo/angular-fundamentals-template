import { inject, Injectable } from "@angular/core";
import {
  Course,
  CourseResponse,
  CreateCourse,
  EditCourse,
  SingleCourseResponse,
  CourseFromAPI,
} from "@app/shared/interfaces/course.interface";
import { BehaviorSubject, catchError, finalize, map, tap, switchMap, forkJoin, of } from "rxjs";
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
    this.isLoading$$.next(true);

    this.coursesService
      .getAll()
      .pipe(
        switchMap((coursesResponse: CourseResponse) => {
          const courses: CourseFromAPI[] = coursesResponse.result;

          const transformedCourses$ = courses.map((course: CourseFromAPI) =>
            forkJoin({
              authors: forkJoin(
                course.authors.map((authorId: string) =>
                  this.coursesService.getAuthorById(authorId).pipe(
                    map((response) => ({ id: authorId, name: response.result?.name || "Unknown Author" })),
                    catchError(() => of({ id: authorId, name: "Unknown Author" }))
                  )
                )
              ),
            }).pipe(
              map(
                ({ authors }) =>
                  ({
                    ...course,
                    authors,
                  } as Course)
              )
            )
          );

          return forkJoin(transformedCourses$);
        }),
        finalize(() => this.isLoading$$.next(false))
      )
      .subscribe({
        next: (transformedCourses: Course[]) => {
          this.courses$$.next(transformedCourses);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  createCourse(course: CreateCourse) {
    this.isLoading$$.next(true);

    return this.coursesService.createCourse(course).pipe(
      tap((response: SingleCourseResponse) => {
        if (response.successful && response.result) {
          const courseFromAPI: CourseFromAPI = response.result;

          forkJoin(
            courseFromAPI.authors.map((authorId: string) =>
              this.coursesService.getAuthorById(authorId).pipe(
                map((authorResponse) => ({ id: authorId, name: authorResponse.result?.name || "Unknown Author" })),
                catchError(() => of({ id: authorId, name: "Unknown Author" }))
              )
            )
          ).subscribe((authors) => {
            const convertedCourse: Course = {
              ...courseFromAPI,
              authors,
            };
            this.courses$$.next([...this.courses$$.value, convertedCourse]);
          });
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
    this.isLoading$$.next(true);

    return this.coursesService.getCourse(id).pipe(
      switchMap((courseResponse: SingleCourseResponse) => {
        if (courseResponse.successful && courseResponse.result) {
          const course: CourseFromAPI = courseResponse.result;

          return forkJoin({
            authors: forkJoin(
              course.authors.map((authorId: string) =>
                this.coursesService.getAuthorById(authorId).pipe(
                  map((response) => ({ id: authorId, name: response.result?.name || "Unknown Author" })),
                  catchError(() => of({ id: authorId, name: "Unknown Author" }))
                )
              )
            ),
          }).pipe(
            map(({ authors }) => ({
              ...courseResponse,
              result: {
                ...course,
                authors,
              } as Course,
            }))
          );
        }
        return of(courseResponse);
      }),
      catchError((err) => {
        console.error(err);
        throw err;
      }),
      finalize(() => this.isLoading$$.next(false))
    );
  }

  editCourse(id: string, course: EditCourse) {
    this.isLoading$$.next(true);

    return this.coursesService.editCourse(id, course).pipe(
      tap((response: SingleCourseResponse) => {
        if (response.successful && response.result) {
          const courseFromAPI: CourseFromAPI = response.result;

          forkJoin(
            courseFromAPI.authors.map((authorId: string) =>
              this.coursesService.getAuthorById(authorId).pipe(
                map((authorResponse) => ({ id: authorId, name: authorResponse.result?.name || "Unknown Author" })),
                catchError(() => of({ id: authorId, name: "Unknown Author" }))
              )
            )
          ).subscribe((authors) => {
            const convertedCourse: Course = {
              ...courseFromAPI,
              authors,
            };

            const currentCourses = this.courses$$.value;
            const updatedCourse = currentCourses.map((course) => (course.id === id ? convertedCourse : course));
            this.courses$$.next(updatedCourse);
          });
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

  getAllAuthors() {
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
    this.isLoading$$.next(true);

    return this.coursesService.getAuthorById(id).pipe(
      map((response: SingleAuthorResponse) => {
        if (response.successful && response.result) {
          return response.result.name;
        }
        return "Unknown Author";
      }),
      catchError((err) => {
        console.error(err);
        throw err;
      }),
      finalize(() => this.isLoading$$.next(false))
    );
  }
}
