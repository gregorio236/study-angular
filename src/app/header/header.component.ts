import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { map } from "rxjs";

import * as fromAuth from "../auth/store/auth.reducer";
import * as fromRecipe from "../recipes/store/recipe.reducer";
import * as fromApp from "../store/app.reducer";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(private readonly store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store
      .select("auth")
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = user != null;
      });
  }

  onSaveData(): void {
    this.store.dispatch(new fromRecipe.Actions.StoreRecipes());
  }

  onFetchData(): void {
    this.store.dispatch(new fromRecipe.Actions.FetchRecipes());
  }

  onLogout(): void {
    this.store.dispatch(new fromAuth.Actions.Logout());
  }
}
