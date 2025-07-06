import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  courseID: string | null = this.route.snapshot.paramMap.get("id");

  ngOnInit(): void {
    this.coursesStore.getAllAuthors().subscribe((authors) => {
      console.log("Authors response:", authors); // Debug log
      this.authors = authors.result; // Ez már a teljes Author objektumok tömbje
      this.authorsNameList = authors.result.map((author) => author.name); // Kivesszük a neveket
      console.log("Authors names:", this.authorsNameList); // Debug log
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
      this.coursesService.getCourse(this.courseID).subscribe((course) => {
        const courseData = course.result;

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
      });
    } else {
      this.rebuildAuthorsFormArrays([]);
    }
  }

  private rebuildAuthorsFormArrays(courseAuthors: string[]): void {
    const authorsArray = this.courseForm.get("authors") as FormArray;
    authorsArray.clear();
    this.authorsNameList.forEach((authorName) => {
      authorsArray.push(this.fb.control(authorName));
    });

    if (courseAuthors.length > 0) {
      // Most már csak stringek (nevek) vannak
      this.courseAuthorsNameList = courseAuthors;

      // ID-k megkeresése a nevekhez
      this.courseAuthorsIds = courseAuthors
        .map((authorName) => {
          const foundAuthor = this.authors.find((a) => a.name === authorName);
          return foundAuthor ? foundAuthor.id : "";
        })
        .filter((id) => id !== "");

      // Szűrés
      this.authorsNameList = this.authorsNameList.filter(
        (authorName) => !this.courseAuthorsNameList.includes(authorName)
      );

      // FormArray újraépítése
      authorsArray.clear();
      this.authorsNameList.forEach((authorName) => {
        authorsArray.push(this.fb.control(authorName));
      });
    }

    // Course Authors FormArray
    const courseAuthorsArray = this.courseForm.get("courseAuthors") as FormArray;
    courseAuthorsArray.clear();
    this.courseAuthorsNameList.forEach((authorName) => {
      courseAuthorsArray.push(this.fb.control(authorName));
    });
  }

  createCourse(course: CreateCourse) {
    console.log("Creating course:", course);
    console.log("Request payload:", JSON.stringify(course, null, 2));

    this.coursesService.createCourse(course).subscribe({
      next: (response) => {
        console.log("Course created successfully:", response);
        this.router.navigate(["/courses"]);
      },
      error: (error) => {
        console.error("Error creating course:", error);
        console.error("Error status:", error.status);
        console.error("Error message:", error.message);

        if (error.error) {
          console.error("Server error object:", error.error);
          if (error.error.errors && Array.isArray(error.error.errors)) {
            console.error("Server validation errors:");
            error.error.errors.forEach((err: any, index: number) => {
              console.error(`Error ${index + 1}:`, err);
            });
          }
        }
      },
    });
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

  addAuthor(authorName: string): void {
    const index = this.authorsNameList.findIndex((item) => item === authorName);

    if (index !== -1) {
      const author = this.authors.find((a) => a.name === authorName);
      if (author) {
        (this.courseForm.get("courseAuthors") as FormArray).push(this.fb.control(authorName));
        this.courseAuthorsNameList.push(authorName);
        this.courseAuthorsIds.push(author.id);

        (this.courseForm.get("authors") as FormArray).removeAt(index);
        this.authorsNameList = this.authorsNameList.filter((item) => item !== authorName);
      }
    }
  }

  onCancel() {
    this.router.navigate(["/courses"]);
  }

  removeAuthor(authorName: string): void {
    const index = this.courseAuthorsNameList.findIndex((item) => item === authorName);

    if (index !== -1) {
      (this.courseForm.get("authors") as FormArray).push(this.fb.control(authorName));
      this.authorsNameList.push(authorName);

      (this.courseForm.get("courseAuthors") as FormArray).removeAt(index);
      this.courseAuthorsNameList = this.courseAuthorsNameList.filter((item) => item !== authorName);
      this.courseAuthorsIds.splice(index, 1);
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
        this.coursesStore.editCourse(this.courseID, course).subscribe({
          next: (response) => {
            console.log("Course updated successfully:", response);
            this.router.navigate(["/courses"]);
          },
          error: (error) => {
            console.error("Error updating course:", error);
            if (error.error && error.error.errors) {
              console.error("Server validation errors:", error.error.errors);
            }
          },
        });
      } else {
        console.log("Creating new course");
        this.createCourse(course);
      }
    } else {
      console.log("Form is invalid:", this.courseForm.errors);

      Object.keys(this.courseForm.controls).forEach((key) => {
        const control = this.courseForm.get(key);
        if (control && control.errors) {
          console.error(`${key} validation errors:`, control.errors);
        }
        control?.markAsTouched();
      });

      if (this.courseAuthorsNameList.length === 0) {
        console.error("No authors selected");
        alert("Please select at least one author");
      }
    }

    console.log("Form submitted.");
  }
}
