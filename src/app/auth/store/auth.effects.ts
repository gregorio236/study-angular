import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User, UserJson } from "../user.model";
import * as fromAuth from "./auth.reducer";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface LoginResponseData extends AuthResponseData {
  registered: boolean;
}

@Injectable()
export class AuthEffects {
  private readonly UserDataKey = "userData";

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuth.Actions.signupStart),
      switchMap((action) =>
        this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(this.handleAuthenticationSuccess.bind(this)),
            catchError(this.handleAuthenticationError.bind(this))
          )
      )
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuth.Actions.loginStart),
      switchMap((action) =>
        this.http
          .post<LoginResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(this.handleAuthenticationSuccess.bind(this)),
            catchError(this.handleAuthenticationError.bind(this))
          )
      )
    )
  );

  authSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuth.Actions.authenticateSuccess),
        tap((action) => {
          if (action.redirect) this.router.navigate(["/"]);
        })
      ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuth.Actions.autoLogin),
      map(() => {
        const userData = localStorage.getItem(this.UserDataKey);
        if (userData == null) return { type: "DUMMY" };

        const user = User.parseJson(JSON.parse(userData) as UserJson);
        if (user.token == null) return { type: "DUMMY" };

        localStorage.setItem(this.UserDataKey, JSON.stringify(user));
        return fromAuth.Actions.authenticateSuccess({
          user,
          redirect: false,
        });
      })
    )
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuth.Actions.logout),
        tap(() => {
          localStorage.removeItem(this.UserDataKey);
          this.authService.clearLogoutTimer();
          this.router.navigate(["/auth"]);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  private handleAuthenticationSuccess(response: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +response.expiresIn * 1000
    );

    const user = new User(
      response.email,
      response.localId,
      response.idToken,
      expirationDate
    );

    localStorage.setItem(this.UserDataKey, JSON.stringify(user));
    this.authService.setLogoutTimer(user.msToTokenExpiration);

    return fromAuth.Actions.authenticateSuccess({ user, redirect: true });
  }

  private handleAuthenticationError(errorResponse: any) {
    let error = "An unkown error occurred!";

    if (errorResponse.error == null || errorResponse.error.error == null)
      return of(fromAuth.Actions.authenticateFail({ error }));

    switch (errorResponse.error.error.message) {
      case "EMAIL_EXISTS":
        error = "The email exists already!";
        break;

      case "EMAIL_NOT_FOUND":
        error = "The email was not found!";
        break;

      case "INVALID_PASSWORD":
        error = "The password is invalid!";
        break;
    }

    return of(fromAuth.Actions.authenticateFail({ error }));
  }
}
