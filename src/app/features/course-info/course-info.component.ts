import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() creationDate!: Date;
  @Input() duration!: number;
  @Input() authors: string[] = [];

  get formattedDate(): string {
    return this.creationDate.toLocaleDateString('hu-HU');
  }

  get formattedDuration(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')} hours`;
  }

  goBack(): void {
    console.log("Back button clicked!");
  }
}
