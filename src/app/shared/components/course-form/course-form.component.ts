import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { mockedAuthorsList } from "@app/shared/mocks/mocks";
import { Author } from "@app/shared/interfaces/author.interface";

@Component({
  selector: "app-course-form",
  templateUrl: "./course-form.component.html",
  styleUrls: ["./course-form.component.scss"],
})
export class CourseFormComponent implements OnInit {
  constructor(public fb: FormBuilder, public library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
  courseForm!: FormGroup;
  // Use the names `title`, `description`, `author`, 'authors' (for authors list), `duration` for the form controls.

  isSubmitted: boolean = false;
  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ["", Validators.compose([Validators.minLength(2), Validators.required])],
      description: ["", Validators.compose([Validators.minLength(2), Validators.required])],
      author: ["", [Validators.minLength(2), this.latinLettersValidator]],
      duration: [0, [Validators.required, Validators.min(0)]],
      authors: this.fb.array([]),
    });
  }

  authorsNameList: Author["name"][] = mockedAuthorsList.map((auth) => auth.name);
  courseAuthorsNameList: Author["name"][] = [];

  private latinLettersValidator(control: any) {
    if (!control.value) return null;
    const latinLettersPattern = /^[a-zA-Z\s]*$/;
    return latinLettersPattern.test(control.value) ? null : { latinLetters: true };
  }

  get authorsFormArray(): FormArray {
    return this.courseForm.get("authors") as FormArray;
  }

  generateAuthorId() {
    return crypto.randomUUID();
  }

  createAuthor(): void {
    const author = this.courseForm.get("author")?.value;

    if (this.authorsNameList.includes(author)) {
      alert("Author is already in Authors List");
      return;
    }
    this.authorsNameList.push(author);

    this.generateAuthorId();

    (this.courseForm.get("authors") as FormArray).push(this.fb.control(author));
    this.courseForm.get("author")?.reset();
  }

  addAuthor(author: string): void {
    const index = this.authorsNameList.findIndex((item) => item === author);
    if (index !== -1) {
      (this.courseForm.get("courseAuthors") as FormArray).push(this.fb.control(author));

      (this.courseForm.get("authors") as FormArray).removeAt(index);

      this.courseAuthorsNameList.push(author);
      this.authorsNameList = this.authorsNameList.filter((item) => item !== author);
    }
  }

  removeAuthor(author: string): void {
    const index = this.courseAuthorsNameList.findIndex((item) => item === author);
    if (index !== -1) {
      (this.courseForm.get("authors") as FormArray).push(this.fb.control(author));

      (this.courseForm.get("courseAuthors") as FormArray).removeAt(index);

      this.authorsNameList.push(author);
      this.courseAuthorsNameList = this.courseAuthorsNameList.filter((item) => item !== author);
    }
  }

  onSubmit(form: FormGroup) {
    this.isSubmitted = true;
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (form.valid) {
      console.log(form.value);
    }

    console.log("Form submitted.");
  }
}
