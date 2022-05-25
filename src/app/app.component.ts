import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromAuth from "./auth/store/auth.reducer";
import * as fromApp from "./store/app.reducer";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(private readonly store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(new fromAuth.Actions.AutoLogin());
  }
}
