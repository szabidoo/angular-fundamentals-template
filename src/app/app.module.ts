import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SharedModule } from "@shared/shared.module";
import { AppComponent } from "@app/app.component";
import { NotAuthorizedGuard } from "@app/auth/guards/not-authorized.guard";
import { AuthorizedGuard } from "@app/auth/guards/authorized.guard";
import { CoursesStoreService } from "@app/services/courses-store.service";
import { CoursesService } from "@app/services/courses.service";
import { CoursesModule } from "./features/courses/courses.module";
import { CoursesListModule } from "./features/courses/courses-list/courses-list.module";
import { CourseInfoModule } from "./features/course-info/course-info.module";
import { Router, RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SharedModule,
    FontAwesomeModule,
    CoursesListModule,
    CourseInfoModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [AuthorizedGuard, NotAuthorizedGuard, CoursesService, CoursesStoreService, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
