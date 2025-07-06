import { Component, Input, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoursesStoreService } from "@app/services/courses-store.service";
@Component({
  selector: "app-course-info",
  templateUrl: "./course-info.component.html",
  styleUrls: ["./course-info.component.scss"],
})
export class CourseInfoComponent implements OnInit {
  @Input() id!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() creationDate!: Date;
  @Input() duration!: number;
  @Input() authors: string[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coursesStore = inject(CoursesStoreService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.coursesStore.getCourse(id).subscribe({
        next: (response) => {
          const course = response.result;
          this.id = course.id;
          this.title = course.title;
          this.description = course.description;
          this.creationDate = course.creationDate;
          this.duration = course.duration;
          this.authors = course.authors;
        },
      });
    }
  }

  goBack(): void {
    console.log("Back button clicked!");

    this.router.navigate(["/courses"]);
  }
}
