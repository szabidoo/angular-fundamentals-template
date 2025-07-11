// @ts-nocheck
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { map, catchError, switchMap } from "rxjs/operators";
import { CoursesService } from "@app/services/courses.service";
import { CoursesStateFacade } from "./courses.facade";
import * as CoursesActions from "./courses.actions";

@Injectable()
export class CoursesEffects {
  constructor(
    private actions$: Actions,
    private coursesService: CoursesService,
    private coursesStateFacade: CoursesStateFacade,
    private router: Router
  ) {}

  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestAllCourses),
      switchMap(() =>
        this.coursesService.getAll().pipe(
          map((response) => CoursesActions.requestAllCoursesSuccess({ courses: response.result })),
          catchError((error) => of(CoursesActions.requestAllCoursesFail({ error: error.message })))
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

  getSpecificCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestSingleCourse),
      switchMap((action) =>
        this.coursesService.getCourse(action.id).pipe(
          map((response) => CoursesActions.requestSingleCourseSuccess({ course: response.result })),
          catchError((error) => of(CoursesActions.requestSingleCourseFail({ error: error.message })))
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
      switchMap((action) =>
        this.coursesService.createCourse(action.course).pipe(
          map((response) => CoursesActions.requestCreateCourseSuccess({ course: response.result })),
          catchError((error) => of(CoursesActions.requestCreateCourseFail({ error: error.message })))
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
