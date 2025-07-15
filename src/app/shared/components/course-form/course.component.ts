import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Subject, combineLatest } from "rxjs";
import { takeUntil, filter, tap, switchMap } from "rxjs/operators";

import { Author } from "@app/shared/interfaces/author.interface";
import { Course, CreateCourse } from "@app/shared/interfaces/course.interface";
import { CoursesStateFacade } from "@app/store/courses/courses.facade";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit, OnDestroy {
  courseForm!: FormGroup;
  allAuthors: Author[] = [];
  availableAuthors: Author[] = [];
  isSubmitted = false;

  private coursesFacade = inject(CoursesStateFacade);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  courseID: string | null = this.route.snapshot.paramMap.get("id");
  authors$ = this.coursesFacade.allAuthors$;

  constructor(public library: FaIconLibrary) {
    library.addIconPacks(fas);
    this.initEmptyForm();
  }

  ngOnInit(): void {
    this.coursesFacade.getAllAuthors();

    this.coursesFacade.allAuthors$.pipe(takeUntil(this.destroy$)).subscribe((authors) => {
      this.allAuthors = authors;
      this.availableAuthors = [...authors];
    });

    if (this.courseID) {
      this.coursesFacade.getSingleCourse(this.courseID);

      this.coursesFacade.course$.pipe(takeUntil(this.destroy$)).subscribe((course) => {
        if (course) {
          this.initCourseForm(course);
          this.setCourseAuthors(course);
          console.log(course);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initEmptyForm(): void {
    this.courseForm = this.fb.group({
      title: ["", [Validators.minLength(2), Validators.required]],
      description: ["", [Validators.minLength(2), Validators.required]],
      newAuthor: ["", [Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      courseAuthors: this.fb.array([], Validators.required),
      duration: [null, [Validators.required, Validators.min(0)]],
    });
  }

  private initCourseForm(course: Course | null): void {
    if (course) {
      this.courseForm.patchValue({
        title: course.title,
        description: course.description,
        duration: course.duration,
        courseAuthor: course.authors.join(""),
      });
    }
  }

  private setCourseAuthors(course: Course): void {
    const courseAuthorsArray = this.courseForm.get("courseAuthors") as FormArray;

    courseAuthorsArray.clear();

    if (course.authors && course.authors.length > 0) {
      course.authors.forEach((authorName) => {
        courseAuthorsArray.push(this.fb.control(authorName));
      });

      const courseAuthorNames = course.authors.map((author) => (typeof author === "string" ? author : author.name));

      this.availableAuthors = this.availableAuthors.filter((author) => !courseAuthorNames.includes(author.name));
    }
  }

  createAuthor(): void {
    const newAuthorName = this.courseForm.get("newAuthor")?.value;
    if (this.courseForm.get("newAuthor")?.valid && newAuthorName) {
      if (this.allAuthors.some((author) => author.name.toLowerCase() === newAuthorName.toLowerCase())) {
        alert("Author already exists.");
        return;
      }
      this.coursesFacade.createAuthor(newAuthorName);
      this.courseForm.get("newAuthor")?.reset();
    }
  }

  addAuthor(authorName: string): void {
    const courseAuthors = this.courseForm.get("courseAuthors") as FormArray;
    if (!courseAuthors.value.includes(authorName)) {
      courseAuthors.push(this.fb.control(authorName));
      this.availableAuthors = this.availableAuthors.filter((author) => author.name !== authorName);
      this.courseForm.get("newAuthor")?.reset();
    }
  }

  removeAuthor(authorName: string): void {
    const courseAuthors = this.courseForm.get("courseAuthors") as FormArray;
    const index = courseAuthors.value.findIndex((name: string) => name === authorName);
    if (index > -1) {
      courseAuthors.removeAt(index);
    }
    this.availableAuthors.push(this.allAuthors.find((author) => author.name === authorName)!);
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.courseForm.invalid) {
      return;
    }

    const formValue = this.courseForm.value;
    const authorNames: string[] = formValue.courseAuthors || [];
    const authorIds = authorNames
      .map((name) => this.allAuthors.find((a) => a.name === name)?.id)
      .filter((id): id is string => !!id);

    const coursePayload: CreateCourse = {
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      duration: Number(formValue.duration),
      authors: authorIds,
    };

    if (this.courseID) {
      this.coursesFacade.editCourse(coursePayload, this.courseID);
    } else {
      this.coursesFacade.createCourse(coursePayload);
    }
  }

  onCancel(): void {
    this.router.navigate(["/courses"]);
  }
}
