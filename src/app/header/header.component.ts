import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { map } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import * as fromApp from "../store/app.reducer";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private readonly dataStorageService: DataStorageService,
    private readonly authService: AuthService,
    private readonly store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store
      .select("auth")
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = user != null;
      });
  }

  onSaveData(): void {
    this.dataStorageService.saveRecipes();
  }

  onFetchData(): void {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
