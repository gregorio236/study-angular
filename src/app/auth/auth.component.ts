import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { AuthResponseData, AuthService } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

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
        this.error = errorMessage;
      },
    });

    form.reset();
  }
}
