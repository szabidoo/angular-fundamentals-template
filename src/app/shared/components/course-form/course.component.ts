import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { mockedAuthorsList } from "@app/shared/mocks/mocks";
import { Author } from "@app/shared/interfaces/author.interface";
import { FormArray } from "@angular/forms";
import { CreateCourse } from "@app/shared/interfaces/course.interface";
import { CoursesService } from "@app/services/courses.service";
import { CoursesStoreService } from "@app/services/courses-store.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit {
  private coursesService = inject(CoursesService);
  private coursesStore = inject(CoursesStoreService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  courseID: string | null = this.route.snapshot.paramMap.get("id");

  constructor(public fb: FormBuilder, public library: FaIconLibrary) {
    library.addIconPacks(fas);
    // Inicializálj egy üres form-ot, hogy a template ne hibázzon
    this.initEmptyForm();
  }

  courseForm!: FormGroup;
  authorsNameList: Author["name"][] = [];
  courseAuthorsNameList: Author["name"][] = [];
  isSubmitted: boolean = false;

  ngOnInit(): void {
    // Először az authors-öket töltsd be, majd inicializáld a form-ot
    this.coursesStore.getAllAuthors().subscribe((authors) => {
      this.authorsNameList = authors.result.map((author) => author.name);
      // Authors betöltése után inicializáld a form-ot
      this.initCourseForm();
    });
  }

  // Üres form inicializálása a constructor-ban
  private initEmptyForm(): void {
    this.courseForm = this.fb.group({
      title: ["", [Validators.minLength(2), Validators.required]],
      description: ["", [Validators.minLength(2), Validators.required]],
      newAuthor: ["", [Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      authors: this.fb.array([]),
      courseAuthors: this.fb.array([], Validators.required),
      duration: [null, [Validators.required, Validators.min(0)]],
    });
  }

  initCourseForm() {
    if (this.courseID) {
      // Get course data and set initial values
      this.coursesService.getCourse(this.courseID).subscribe((course) => {
        const courseData = course.result;

        // Frissítsd a meglévő form-ot
        this.courseForm.patchValue({
          title: courseData?.title || "",
          description: courseData?.description || "",
          duration: courseData?.duration || null,
        });

        // Authors FormArray-ek újraépítése
        this.rebuildAuthorsFormArrays(courseData?.authors || []);
      });
    } else {
      // Create mode - csak a FormArray-eket építsd újra
      this.rebuildAuthorsFormArrays([]);
    }
  }

  private rebuildAuthorsFormArrays(courseAuthors: any[]): void {
    // Authors FormArray újraépítése
    const authorsArray = this.courseForm.get("authors") as FormArray;
    authorsArray.clear();
    this.authorsNameList.forEach((authorName) => {
      authorsArray.push(this.fb.control(authorName));
    });

    // Course Authors beállítása
    if (courseAuthors.length > 0) {
      this.courseAuthorsNameList = courseAuthors.map((author) => (typeof author === "string" ? author : author.name));

      // Távolítsd el a course authors-öket az available authors-ből
      this.authorsNameList = this.authorsNameList.filter(
        (authorName) => !this.courseAuthorsNameList.includes(authorName)
      );

      // Authors FormArray újraépítése a szűrt listával
      authorsArray.clear();
      this.authorsNameList.forEach((authorName) => {
        authorsArray.push(this.fb.control(authorName));
      });
    }

    // Course Authors FormArray újraépítése
    const courseAuthorsArray = this.courseForm.get("courseAuthors") as FormArray;
    courseAuthorsArray.clear();
    this.courseAuthorsNameList.forEach((authorName) => {
      courseAuthorsArray.push(this.fb.control(authorName));
    });
  }

  createCourse(course: CreateCourse) {
    this.coursesService.createCourse(course);
  }

  createAuthor(): void {
    const author: string = this.courseForm.get("newAuthor")?.value;

    if (!this.courseForm) return;

    if (this.authorsNameList.includes(author)) {
      alert("Author is already in Authors List");
      return;
    }
    this.authorsNameList.push(author);

    this.coursesStore.createAuthor(author).subscribe();

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
      const course = this.courseForm.value;

      if (this.courseID) {
        this.coursesStore.editCourse(this.courseID, course);
      } else {
        this.coursesStore.createCourse(course);
      }

      this.router.navigate(["/courses"]);
    }

    console.log("Form submitted.");
  }
}
