import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as fromAuth from "./store/auth.reducer";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface LoginResponseData extends AuthResponseData {
  registered: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private tokenExpirationTimer: NodeJS.Timeout | null = null;

  constructor(private readonly store: Store<fromApp.AppState>) {}

  setLogoutTimer(msToTokenExpiration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(fromAuth.Actions.logout());
    }, msToTokenExpiration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer != null) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
