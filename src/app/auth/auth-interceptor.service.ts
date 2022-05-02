import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable, take } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.userSubject.pipe(
      take(1),
      exhaustMap((user) => {
        if (user == null || user.token == null) {
          return next.handle(request);
        }

        const newRequest = request.clone({
          params: new HttpParams().set("auth", user.token),
        });
        return next.handle(newRequest);
      })
    );
  }
}
