import { Component, OnInit, inject } from "@angular/core";
import { AuthStateFacade } from "@app/store/auth/auth.facade";
import { UserStateFacade } from "@app/store/user/user.facade";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "courses-app";
  isLoggedIn = false;
  private router = inject(Router);
  isAuthorized$ = this.authFacade.isAuthorized$;
  name$ = this.userFacade.name$;

  constructor(private authFacade: AuthStateFacade, private userFacade: UserStateFacade) {}

  ngOnInit(): void {
    this.authFacade.checkAuth();
  }

  logout(): void {
    console.log("Logging out...");
    this.authFacade.logout();
    this.userFacade.clearUser();
  }
}
