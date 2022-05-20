import { Action } from "@ngrx/store";

import { User } from "../user.model";

export const LOGIN: string = "[Auth] Login";
export const LOGOUT: string = "[Auth] Logout";

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload?: User) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions = Login | Logout;
