import { Component, Input } from "@angular/core";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas, IconName } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent {
  @Input() buttonText?: string;
  @Input() iconName?: IconName;
  @Input() variant?: "outlined" | null;

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
