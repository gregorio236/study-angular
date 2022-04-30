import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";

import { User, UserJson } from "./user.model";

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
export class AuthService {
  userSubject = new BehaviorSubject<User | null>(null);

  private readonly UserDataKey = "userData";
  private tokenExpirationTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDIyp53e28H2YJGue2cR_n27qp-r8ppA80",
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.handleError), tap(this.handleAuthentication));
  }

  login(email: string, password: string): Observable<LoginResponseData> {
    return this.http
      .post<LoginResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDIyp53e28H2YJGue2cR_n27qp-r8ppA80",
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((response) => this.handleAuthentication(response))
      );
  }

  autoLogin(): void {
    const userData = localStorage.getItem(this.UserDataKey);
    if (userData == null) return;

    const user = User.parseJson(JSON.parse(userData) as UserJson);
    if (user.token == null) return;

    this.userSubject.next(user);
    this.autoLogout(user.msToTokenExpiration);
  }

  logout(): void {
    this.userSubject.next(null);
    localStorage.removeItem(this.UserDataKey);

    if (this.tokenExpirationTimer != null) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }

    void this.router.navigate(["/auth"]);
  }

  private autoLogout(msToTokenExpiration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, msToTokenExpiration);
  }

  private handleAuthentication(response: AuthResponseData): void {
    const expirationDate = new Date(
      new Date().getTime() + +response.expiresIn * 1000
    );

    const user = new User(
      response.email,
      response.localId,
      response.idToken,
      expirationDate
    );

    this.userSubject.next(user);
    this.autoLogout(user.msToTokenExpiration);
    localStorage.setItem(this.UserDataKey, JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<never> {
    const unkownError = "An unkown error occurred!";

    if (errorResponse.error == null || errorResponse.error.error == null)
      return throwError(() => new Error(unkownError));

    switch (errorResponse.error.error.message) {
      case "EMAIL_EXISTS":
        return throwError(() => new Error("The email exists already!"));

      case "EMAIL_NOT_FOUND":
        return throwError(() => new Error("The email was not found!"));

      case "INVALID_PASSWORD":
        return throwError(() => new Error("The password is invalid!"));

      default:
        return throwError(() => new Error(unkownError));
    }
  }
}
