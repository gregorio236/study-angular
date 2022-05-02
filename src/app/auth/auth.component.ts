import { Component, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder.directive";

import { AuthResponseData, AuthService } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private alertCloseSubscription: Subscription | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnDestroy(): void {
    this.alertCloseSubscription?.unsubscribe();
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!(form.valid ?? false)) return;

    this.isLoading = true;
    const { email, password } = form.value;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: (response) => {
        this.isLoading = false;
        void this.router.navigate(["/recipes"]);
      },
      error: (errorMessage) => {
        this.isLoading = false;
        this.showErrorAlert(errorMessage);
      },
    });

    form.reset();
  }

  private showErrorAlert(error: string): void {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertComponentRef =
      hostViewContainerRef.createComponent(AlertComponent);

    alertComponentRef.instance.message = error;
    this.alertCloseSubscription = alertComponentRef.instance.close.subscribe(
      () => {
        this.alertCloseSubscription?.unsubscribe();

        hostViewContainerRef.clear();
      }
    );
  }
}
