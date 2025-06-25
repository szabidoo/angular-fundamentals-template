import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() creationDate!: Date;
  @Input() duration!: number;
  @Input() authors: string[] = [];
  @Input() editable: boolean = false;

  @Output() clickOnShow = new EventEmitter<void>();

  get formattedDate(): string {
    return this.creationDate.toLocaleDateString('hu-HU');
  }

  get formattedDuration(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')} hours`;
  }
}
