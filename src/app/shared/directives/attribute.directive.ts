import { Directive, ElementRef, Renderer2 } from "@angular/core";
import { IconName } from "@fortawesome/fontawesome-common-types";

@Directive({
  selector: "[appAttribute]",
  exportAs: "togglePassword",
})
export class AttributeDirective {
  private _isPasswordVisible = false;

  constructor(private elementRef: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  get isPasswordVisible(): boolean {
    return this._isPasswordVisible;
  }

  get eyeIcon(): IconName {
    return this._isPasswordVisible ? "eye-slash" : "eye";
  }

  get toggleButtonText(): string {
    return this._isPasswordVisible ? "Hide" : "Show";
  }

  togglePasswordVisibility(): void {
    this._isPasswordVisible = !this._isPasswordVisible;
    const inputType = this._isPasswordVisible ? "text" : "password";
    this.renderer.setAttribute(this.elementRef.nativeElement, "type", inputType);
  }
}
