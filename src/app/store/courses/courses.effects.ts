// @ts-nocheck
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { map, catchError, switchMap, mergeMap, tap, concatMap } from "rxjs/operators";
import { CoursesService } from "@app/services/courses.service";
import * as CoursesActions from "./courses.actions";

@Injectable()
export class CoursesEffects {
  constructor(private actions$: Actions, private coursesService: CoursesService, private router: Router) {}

  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestAllCourses),
      switchMap(() =>
        this.coursesService.getAll().pipe(
          switchMap((response) =>
            this.coursesService.getAllAuthors().pipe(
              map((authorsResponse) => {
                const authors = authorsResponse.result;
                const coursesWithAuthorNames = response.result.map((course) => ({
                  ...course,
                  authors: course.authors.map((authorId) => {
                    const author = authors.find((a) => a.id === authorId);
                    return author ? author.name : authorId;
                  }),
                }));
                return CoursesActions.requestAllCoursesSuccess({ courses: coursesWithAuthorNames });
              })
            )
          ),
          catchError((error) => of(CoursesActions.requestAllCoursesFail({ error: error.message })))
        )
      )
    )
  );
  getSpecificCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestSingleCourse),
      switchMap((action) =>
        this.coursesService.getCourse(action.id).pipe(
          switchMap((response) =>
            this.coursesService.getAllAuthors().pipe(
              map((authorsResponse) => {
                const authors = authorsResponse.result;
                const courseWithAuthorNames = {
                  ...response.result,
                  authors: response.result.authors.map((authorId) => {
                    const author = authors.find((a) => a.id === authorId);
                    return author ? author.name : authorId;
                  }),
                };
                return CoursesActions.requestSingleCourseSuccess({ course: courseWithAuthorNames });
              })
            )
          ),
          catchError((error) => of(CoursesActions.requestSingleCourseFail({ error: error.message })))
        )
      )
    )
  );

  filteredCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestFilteredCourses),
      switchMap((action) =>
        this.coursesService.getAll().pipe(
          map((response) => {
            const courses = response.result;
            const searchTerm = action.title.toLowerCase();
            const filteredCourses = courses.filter(
              (course) =>
                course.title.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm) ||
                course.duration.toString().includes(searchTerm)
            );
            return CoursesActions.requestFilteredCoursesSuccess({ courses: filteredCourses });
          }),
          catchError((error) => of(CoursesActions.requestFilteredCoursesFail({ error: error.message })))
        )
      )
    )
  );

  deleteCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestDeleteCourse),
      switchMap((action) =>
        this.coursesService.deleteCourse(action.id).pipe(
          map(() => CoursesActions.requestAllCourses()),
          catchError((error) => of(CoursesActions.requestDeleteCourseFail({ error: error.message })))
        )
      )
    )
  );

  editCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestEditCourse),
      switchMap((action) =>
        this.coursesService.editCourse(action.id, action.course).pipe(
          map((response) => CoursesActions.requestEditCourseSuccess({ course: response.result })),
          catchError((error) => of(CoursesActions.requestEditCourseFail({ error: error.message })))
        )
      )
    )
  );

  createCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestCreateCourse),
      mergeMap(({ course }) =>
        this.coursesService.createCourse(course).pipe(
          concatMap((response) => {
            console.log("Create course response:", response);

            if (!response.result.creationDate) {
              console.warn("Missing creationDate in create course response");
              response.result.creationDate = new Date().toISOString();
            }

            return this.coursesService.getAllAuthors().pipe(
              map((authorsResponse) => {
                const authors = authorsResponse.result;

                const courseWithAuthors = {
                  ...response.result,
                  authors: response.result.authors
                    .map((authorId) => authors.find((author) => author.id === authorId))
                    .filter((author): author is Author => !!author),
                };

                return CoursesActions.requestCreateCourseSuccess({ course: courseWithAuthors });
              })
            );
          }),
          catchError((error) => of(CoursesActions.requestCreateCourseFail({ error: error.message })))
        )
      )
    )
  );

  getAllAuthors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestAllAuthors),
      mergeMap(() =>
        this.coursesService.getAllAuthors().pipe(
          map((response) => CoursesActions.requestAllAuthorsSuccess({ authors: response.result })),
          catchError((error) => of(CoursesActions.requestAllAuthorsFail({ error: error.message })))
        )
      )
    )
  );

  getSingleAuthor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestSingleAuthor),
      switchMap((action) =>
        this.coursesService.getAuthorById(action.id).pipe(
          map((response) => CoursesActions.requestSingleAuthorSuccess({ author: response.result })),
          catchError((error) => of(CoursesActions.requestSingleAuthorFail({ error: error.message })))
        )
      )
    )
  );

  createAuthor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestCreateAuthor),
      mergeMap(({ name }) =>
        this.coursesService.createAuthor(name).pipe(
          map((response) => CoursesActions.requestCreateAuthorSuccess({ author: response.result })),
          catchError((error) => of(CoursesActions.requestCreateAuthorFail({ error: error.message })))
        )
      )
    )
  );

  redirectToTheCoursesPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CoursesActions.requestCreateCourseSuccess,
          CoursesActions.requestEditCourseSuccess,
          CoursesActions.requestSingleCourseFail
        ),
        map(() => {
          this.router.navigate(["/courses"]);
          return { type: "NO_ACTION" };
        })
      ),
    { dispatch: false }
  );
}
