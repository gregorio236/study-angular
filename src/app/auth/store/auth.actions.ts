import { Action } from "@ngrx/store";

import { User } from "../user.model";

export const SIGNUP_START: string = "[Auth] Signup Start";
export const LOGIN_START: string = "[Auth] Login Start";
export const AUTHENTICATE_SUCCESS: string = "[Auth] Authenticate Success";
export const AUTHENTICATE_FAIL: string = "[Auth] Authenticate Fail";
export const AUTO_LOGIN: string = "[Auth] Auto Login";
export const LOGOUT: string = "[Auth] Logout";

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload?: { email: string; password: string }) {}
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload?: { email: string; password: string }) {}
}

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(public payload?: User) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload?: string) {}
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions =
  | SignupStart
  | LoginStart
  | AuthenticateSuccess
  | AuthenticateFail
  | AutoLogin
  | Logout;
