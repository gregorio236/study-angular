import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;

  private userSubscription: Subscription;

  constructor(
    private readonly dataStorageService: DataStorageService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.userSubject.subscribe((user) => {
      this.isAuthenticated = user != null;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
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
