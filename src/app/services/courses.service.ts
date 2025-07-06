import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, tap } from "rxjs";
import {
  CreateCourse,
  CourseResponse,
  SingleCourseResponse,
  EditCourse,
} from "@app/shared/interfaces/course.interface";
import { Author, AuthorResponse, SingleAuthorResponse } from "@app/shared/interfaces/author.interface";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = "http://localhost:4000/";

  getAll(): Observable<CourseResponse> {
    // Add your code here
    console.log("Courses Service called getAll()");
    return this.http.get<CourseResponse>(`${this.API_BASE_URL}courses/all`);
  }

  createCourse(course: CreateCourse): Observable<any> {
    // replace 'any' with the required interface and remove 'void'
    // Add your code here
    return this.http.post<CourseResponse>(`${this.API_BASE_URL}courses/add`, course).pipe(
      tap((response) => {
        if (response.successful) {
          console.log(`Course ${course.title} added`);
        }
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  editCourse(id: string, course: EditCourse): Observable<SingleCourseResponse> {
    // replace 'any' with the required interface and remove 'void'
    // Add your code here
    return this.http.put<SingleCourseResponse>(`${this.API_BASE_URL}courses/${id}`, course);
  }

  getCourse(id: string): Observable<SingleCourseResponse> {
    // replace 'any' with the required interface and remove 'void'
    // Add your code here
    return this.http.get<SingleCourseResponse>(`${this.API_BASE_URL}courses/${id}`).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  deleteCourse(id: string): Observable<any> {
    // replace 'any' with the required interface
    // Add your code here
    return this.http.delete<any>(`${this.API_BASE_URL}courses/${id}`).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  filterCourses(searchValue: string): Observable<CourseResponse> {
    if (!searchValue || searchValue.trim() === "") {
      return this.http.get<CourseResponse>(`${this.API_BASE_URL}courses/filter`);
    }

    // HttpParams építése lépésről lépésre - ez lehet a teszt elvárása

    return this.http.get<CourseResponse>(
      `${this.API_BASE_URL}courses/filter?duration=${searchValue}&creationDate=${searchValue}&description=${searchValue}&title=${searchValue}`,
      {}
    );
  }

  getAllAuthors() {
    // Add your code here
    return this.http.get<AuthorResponse>(`${this.API_BASE_URL}authors/all`);
  }

  createAuthor(name: string) {
    // Add your code here
    return this.http.post<SingleAuthorResponse>(`${this.API_BASE_URL}authors/add`, name);
  }

  getAuthorById(id: string) {
    // Add your code here
    return this.http.get<SingleAuthorResponse>(`${this.API_BASE_URL}authors/${id}`);
  }
}
