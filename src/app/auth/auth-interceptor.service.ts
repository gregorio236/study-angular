import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, map, Observable, take } from "rxjs";

import * as fromApp from "../store/app.reducer";

@Injectable({ providedIn: "root" })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private readonly store: Store<fromApp.AppState>) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select("auth").pipe(
      take(1),
      map((authState) => authState.user),
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
