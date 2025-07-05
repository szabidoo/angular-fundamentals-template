import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { mockedAuthorsList } from "@app/shared/mocks/mocks";
import { Author } from "@app/shared/interfaces/author.interface";
import { FormArray } from "@angular/forms";
import { CreateCourse } from "@app/shared/interfaces/course.interface";
import { CoursesService } from "@app/services/courses.service";
@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit {
  private coursesService = inject(CoursesService);

  constructor(public fb: FormBuilder, public library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
  courseForm!: FormGroup;
  // Use the names `title`, `description`, `author`, 'authors' (for authors list), `duration` for the form controls.

  authorsNameList: Author["name"][] = mockedAuthorsList.map((auth) => auth.name);
  courseAuthorsNameList: Author["name"][] = [];

  isSubmitted: boolean = false;
  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ["", [Validators.minLength(2), Validators.required]],
      description: ["", [Validators.minLength(2), Validators.required]],
      newAuthor: ["", [Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      authors: this.fb.array(this.authorsNameList),
      courseAuthors: this.fb.array([], Validators.required),
      duration: [null, [Validators.required, Validators.min(0)]],
    });
  }

  createCourse(course: CreateCourse) {
    this.coursesService.createCourse(course);
  }

  createAuthor(): void {
    const author = this.courseForm.get("newAuthor")?.value;

    if (!this.courseForm) return;

    if (this.authorsNameList.includes(author)) {
      alert("Author is already in Authors List");
      return;
    }
    this.authorsNameList.push(author);

    (this.courseForm.get("authors") as FormArray).push(this.fb.control(author));
    this.courseForm.get("newAuthor")?.setValue("");
  }

  addAuthor(author: string): void {
    const index = this.authorsNameList.findIndex((item) => item === author);

    if (!this.courseForm) return;

    if (index !== -1) {
      (this.courseForm.get("courseAuthors") as FormArray).push(this.fb.control(author));

      (this.courseForm.get("authors") as FormArray).removeAt(index);

      this.courseAuthorsNameList.push(author);
      this.authorsNameList = this.authorsNameList.filter((item) => item !== author);
    }
  }

  removeAuthor(author: string): void {
    const index = this.courseAuthorsNameList.findIndex((item) => item === author);

    if (!this.courseForm) return;
    if (index !== -1) {
      (this.courseForm.get("authors") as FormArray).push(this.fb.control(author));

      (this.courseForm.get("courseAuthors") as FormArray).removeAt(index);

      this.authorsNameList.push(author);
      this.courseAuthorsNameList = this.courseAuthorsNameList.filter((item) => item !== author);
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.courseForm.valid) {
      console.log(this.courseForm.value);
    }

    console.log("Form submitted.");
  }
}
