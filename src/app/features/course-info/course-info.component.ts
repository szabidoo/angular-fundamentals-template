import { Component, Input, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Author } from "@app/shared/interfaces/author.interface";
import { CoursesStateFacade } from "@app/store/courses/courses.facade";

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
  @Input() authors: Author[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coursesFacade = inject(CoursesStateFacade);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.coursesFacade.getSingleCourse(id);

      this.coursesFacade.course$.subscribe({
        next: (course) => {
          if (course) {
            this.id = course.id;
            this.title = course.title;
            this.description = course.description;
            this.creationDate = course.creationDate;
            this.duration = course.duration;
            this.authors = course.authors;
          }
        },
      });
    }
  }

  goBack(): void {
    console.log("Back button clicked!");
    this.router.navigate(["/courses"]);
  }
}
