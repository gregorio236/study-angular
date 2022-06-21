import { Action, createReducer, on } from "@ngrx/store";

import { User } from "../user.model";
import * as Actions from "./auth.actions";

export * as Actions from "./auth.actions";

export interface State {
  user: User | null;
  authError: string | null;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

const _authReducer = createReducer(
  initialState,

  on(Actions.signupStart, Actions.loginStart, (state) => ({
    ...state,
    authError: null,
    loading: true,
  })),

  on(Actions.authenticateSuccess, (state, action) => ({
    ...state,
    user: action.user,
    authError: null,
    loading: false,
  })),

  on(Actions.authenticateFail, (state, action) => ({
    ...state,
    user: null,
    authError: action.error,
    loading: false,
  })),

  on(Actions.logout, (state) => ({
    ...state,
    user: null,
  }))
);

export function authReducer(state: State | undefined, action: Action) {
  return _authReducer(state, action);
}
