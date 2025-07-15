import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { UserService } from "@app/user/services/user.service";
import * as UserActions from "./user.actions";

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  requestUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.requestUser),
      mergeMap(() =>
        this.userService.getUser().pipe(
          map((response) => {
            if (response.successful && response.result) {
              return UserActions.requestUserSuccess({ user: response.result });
            }
            return UserActions.requestUserFail({ error: "Failed to get user" });
          }),
          catchError((error) => of(UserActions.requestUserFail({ error: error.message })))
        )
      )
    )
  );
}
