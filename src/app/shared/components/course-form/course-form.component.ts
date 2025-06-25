import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { mockedAuthorsList } from "@app/shared/mocks/mocks";
import { Author } from "@app/shared/interfaces/author.interface";
import { FormArray } from "@angular/forms";
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

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ["", Validators.compose([Validators.minLength(2), Validators.required])],
      description: ["", Validators.compose([Validators.minLength(2), Validators.required])],
      author: ["", Validators.minLength(2)],
      authors: this.fb.array(this.authorsNameList),
      courseAuthors: this.fb.array([]),
      duration: [null, [Validators.required, Validators.min(0)]],
    });
  }

  authorsNameList: Author["name"][] = mockedAuthorsList.map((auth) => auth.name);

  createAuthor(author: string): void {
    if (this.authorsNameList.includes(author)) {
      alert("Author is already in Authors List");
      return;
    }
    this.authorsNameList.push(author);
    (this.courseForm.get("authors") as FormArray).push(this.fb.control(author));
  }

  addAuthor(author: string): void {}

  onSubmit(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (form.valid) {
      console.log(form.value);
    }

    console.log("Form submitted.");
  }
}
