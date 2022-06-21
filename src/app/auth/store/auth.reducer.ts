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

export function authReducer(
  state: State | undefined,
  action: Actions.AuthActions
): State {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case Actions.SIGNUP_START:
    case Actions.LOGIN_START: {
      return {
        ...state,
        authError: null,
        loading: true,
      };
    }

    case Actions.AUTHENTICATE_SUCCESS: {
      const loginAction = action as Actions.AuthenticateSuccess;
      if (loginAction.payload == null) return state;

      return {
        ...state,
        user: loginAction.payload.user,
        authError: null,
        loading: false,
      };
    }

    case Actions.AUTHENTICATE_FAIL: {
      const failAction = action as Actions.AuthenticateFail;

      return {
        ...state,
        user: null,
        authError: failAction.payload!,
        loading: false,
      };
    }

    case Actions.LOGOUT:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
}
