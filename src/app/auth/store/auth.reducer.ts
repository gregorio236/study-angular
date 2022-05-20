import { User } from "../user.model";
import * as Actions from "./auth.actions";

export * as Actions from "./auth.actions";

export interface State {
  user: User | null;
}

const initialState: State = {
  user: null,
};

export function authReducer(
  state: State | undefined,
  action: Actions.AuthActions
): State {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case Actions.LOGIN: {
      const loginAction = action as Actions.Login;
      if (loginAction.payload == null) return state;

      return {
        ...state,
        user: loginAction.payload,
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
