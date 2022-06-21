import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromAuth from "./auth/store/auth.reducer";
import * as fromApp from "./store/app.reducer";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(
    private readonly store: Store<fromApp.AppState>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId))
      this.store.dispatch(fromAuth.Actions.autoLogin());
  }
}
