import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent {
  // Use the name `placeholder` for the @Input.
  // Use the name `search` for the @Output.

  @ViewChild("searchInput") searchInput!: ElementRef;
  @Input() value?: string;
  @Input() placeholder?: string;
  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  resetInput() {
    this.value = "";
    this.valueChange.emit(this.value);
  }

  onSubmit(value: string) {
    const searchValue = value;
    console.log("Search form submitted!");
    this.search.emit(searchValue);
    this.resetInput();
  }
}
