import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as fromAuth from "./store/auth.reducer";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  constructor(private readonly store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select("auth").subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!(form.valid ?? false)) return;

    this.isLoading = true;
    const { email, password } = form.value;

    if (this.isLoginMode) {
      this.store.dispatch(fromAuth.Actions.loginStart({ email, password }));
    } else {
      this.store.dispatch(fromAuth.Actions.signupStart({ email, password }));
    }

    form.reset();
  }
}
