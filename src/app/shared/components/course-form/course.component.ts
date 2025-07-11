import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Author } from "@app/shared/interfaces/author.interface";
import { FormArray } from "@angular/forms";
import { CreateCourse } from "@app/shared/interfaces/course.interface";
import { CoursesService } from "@app/services/courses.service";
import { CoursesStoreService } from "@app/services/courses-store.service";
import { CoursesStateFacade } from "@app/store/courses/courses.facade";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit {
  courseForm!: FormGroup;
  authorsNameList: Author["name"][] = [];
  courseAuthorsNameList: Author["name"][] = [];

  authors: Author[] = [];
  courseAuthorsIds: string[] = [];

  isSubmitted: boolean = false;

  constructor(public fb: FormBuilder, public library: FaIconLibrary) {
    library.addIconPacks(fas);
    this.initEmptyForm();
  }

  private coursesService = inject(CoursesService);
  private coursesStore = inject(CoursesStoreService);
  private coursesFacade = inject(CoursesStateFacade);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  courseID: string | null = this.route.snapshot.paramMap.get("id");

  ngOnInit(): void {
    this.coursesStore.getAllAuthors().subscribe((authors) => {
      console.log("Authors response:", authors);
      this.authors = authors.result;
      this.authorsNameList = authors.result.map((author) => author.name);
      console.log("Authors names:", this.authorsNameList);
      this.initCourseForm();
    });
  }

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
      this.coursesFacade.getSingleCourse(this.courseID);

      this.coursesFacade.course$.subscribe((courseResponse) => {
        if (courseResponse) {
          const courseData = courseResponse;

          this.courseForm.patchValue({
            title: courseData?.title || "",
            description: courseData?.description || "",
            duration: courseData?.duration || null,
          });

          const courseAuthorsWithNames = (courseData?.authors || [])
            .map((authorId: string) => {
              const foundAuthor = this.authors.find((a) => a.id === authorId);
              return foundAuthor ? foundAuthor.name : null;
            })
            .filter((name): name is string => name !== null);

          console.log("Course authors converted to names:", courseAuthorsWithNames);

          this.rebuildAuthorsFormArrays(courseAuthorsWithNames);
        }
      });
    } else {
      this.rebuildAuthorsFormArrays([]);
    }
  }

  private rebuildAuthorsFormArrays(courseAuthors: string[]): void {
    const authorsFormArray = this.courseForm.get("authors") as FormArray;
    const courseAuthorsFormArray = this.courseForm.get("courseAuthors") as FormArray;

    authorsFormArray.clear();
    courseAuthorsFormArray.clear();

    this.courseAuthorsNameList = [...courseAuthors];

    courseAuthors.forEach((authorName) => {
      courseAuthorsFormArray.push(this.fb.control(authorName));
    });

    this.courseAuthorsIds = courseAuthors
      .map((authorName) => {
        const foundAuthor = this.authors.find((a) => a.name === authorName);
        return foundAuthor ? foundAuthor.id : null;
      })
      .filter((id): id is string => id !== null);

    console.log("Course authors IDs:", this.courseAuthorsIds);
  }

  createCourse(course: CreateCourse) {
    console.log("Creating course:", course);
    console.log("Request payload:", JSON.stringify(course, null, 2));

    this.coursesFacade.createCourse(course);
  }

  createAuthor(): void {
    const author: string = this.courseForm.get("newAuthor")?.value;

    if (!this.courseForm) return;

    if (this.authorsNameList.includes(author)) {
      alert("Author is already in Authors List");
      return;
    }

    this.coursesStore.createAuthor(author).subscribe({
      next: (response) => {
        console.log("Author created successfully:", response);

        this.coursesStore.getAllAuthors().subscribe((authors) => {
          this.authors = authors.result;
          this.authorsNameList.push(author);

          (this.courseForm.get("authors") as FormArray).push(this.fb.control(author));
          this.courseForm.get("newAuthor")?.setValue("");
        });
      },
      error: (error) => {
        console.error("Error creating author:", error);
        alert("Failed to create author");
      },
    });
  }

  addAuthor(authorName: string): void {
    if (!this.courseAuthorsNameList.includes(authorName)) {
      this.courseAuthorsNameList.push(authorName);

      const foundAuthor = this.authors.find((a) => a.name === authorName);
      if (foundAuthor) {
        this.courseAuthorsIds.push(foundAuthor.id);
      }

      const courseAuthorsFormArray = this.courseForm.get("courseAuthors") as FormArray;
      courseAuthorsFormArray.push(this.fb.control(authorName));

      console.log("Added author:", authorName);
      console.log("Updated course authors IDs:", this.courseAuthorsIds);
    }
  }

  onCancel() {
    this.router.navigate(["/courses"]);
  }

  removeAuthor(authorName: string): void {
    const index = this.courseAuthorsNameList.indexOf(authorName);
    if (index > -1) {
      this.courseAuthorsNameList.splice(index, 1);

      const foundAuthor = this.authors.find((a) => a.name === authorName);
      if (foundAuthor) {
        const idIndex = this.courseAuthorsIds.indexOf(foundAuthor.id);
        if (idIndex > -1) {
          this.courseAuthorsIds.splice(idIndex, 1);
        }
      }

      const courseAuthorsFormArray = this.courseForm.get("courseAuthors") as FormArray;
      courseAuthorsFormArray.removeAt(index);

      console.log("Removed author:", authorName);
      console.log("Updated course authors IDs:", this.courseAuthorsIds);
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;

      const course: CreateCourse = {
        title: formValue.title?.trim() || "",
        description: formValue.description?.trim() || "",
        duration: Number(formValue.duration) || 0,
        authors: this.courseAuthorsIds || [],
      };

      if (!course.title || course.title.length < 2) {
        console.error("Title validation failed:", course.title);
        return;
      }

      if (!course.description || course.description.length < 2) {
        console.error("Description validation failed:", course.description);
        return;
      }

      if (!course.duration || course.duration <= 0) {
        console.error("Duration validation failed:", course.duration);
        return;
      }

      if (!course.authors || course.authors.length === 0) {
        console.error("Authors validation failed - no authors selected");
        alert("Please select at least one author");
        return;
      }

      console.log("Submitting course with author IDs:", course);

      if (this.courseID) {
        console.log("Editing course with ID:", this.courseID);
        this.coursesFacade.editCourse(course, this.courseID);
      } else {
        console.log("Creating new course");
        this.createCourse(course);
      }
    }
  }
}
