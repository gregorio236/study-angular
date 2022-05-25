import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
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

  signup = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuth.Actions.SIGNUP_START),
      switchMap((signupAction: fromAuth.Actions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
            {
              email: signupAction.payload?.email,
              password: signupAction.payload?.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(this.handleAuthenticationSuccess.bind(this)),
            catchError(this.handleAuthenticationError.bind(this))
          );
      })
    )
  );

  login = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuth.Actions.LOGIN_START),
      switchMap((loginAction: fromAuth.Actions.LoginStart) => {
        return this.http
          .post<LoginResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
            {
              email: loginAction.payload?.email,
              password: loginAction.payload?.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(this.handleAuthenticationSuccess.bind(this)),
            catchError(this.handleAuthenticationError.bind(this))
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuth.Actions.AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(["/"]);
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuth.Actions.AUTO_LOGIN),
      map(() => {
        const userData = localStorage.getItem(this.UserDataKey);
        if (userData == null) return { type: "DUMMY" };

        const user = User.parseJson(JSON.parse(userData) as UserJson);
        if (user.token == null) return { type: "DUMMY" };

        localStorage.setItem(this.UserDataKey, JSON.stringify(user));
        return new fromAuth.Actions.AuthenticateSuccess(user);
      })
    )
  );

  logout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuth.Actions.LOGOUT),
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

  private handleAuthenticationSuccess(
    response: AuthResponseData
  ): fromAuth.Actions.AuthenticateSuccess {
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

    return new fromAuth.Actions.AuthenticateSuccess(user);
  }

  private handleAuthenticationError(
    errorResponse: any
  ): Observable<fromAuth.Actions.AuthenticateFail> {
    let errorMessage = "An unkown error occurred!";

    if (errorResponse.error == null || errorResponse.error.error == null)
      return of(new fromAuth.Actions.AuthenticateFail(errorMessage));

    switch (errorResponse.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "The email exists already!";
        break;

      case "EMAIL_NOT_FOUND":
        errorMessage = "The email was not found!";
        break;

      case "INVALID_PASSWORD":
        errorMessage = "The password is invalid!";
        break;
    }

    return of(new fromAuth.Actions.AuthenticateFail(errorMessage));
  }
}
