import { Ingredient } from "src/app/shared/ingredient.model";
import * as Actions from "./shopping-list.actions";

export * as Actions from "./shopping-list.actions";

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient | null;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient("Apples", 5), new Ingredient("Tomatoes", 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state: State | undefined,
  action: Actions.ShoppingListActions
): State {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case Actions.ADD_INGREDIENT: {
      const addAction = action as Actions.AddIngredient;
      if (addAction.payload == null) return state;

      return {
        ...state,
        ingredients: [...state.ingredients, addAction.payload],
      };
    }

    case Actions.ADD_INGREDIENTS: {
      const addAction = action as Actions.AddIngredients;
      if (addAction.payload == null) return state;

      return {
        ...state,
        ingredients: [...state.ingredients, ...addAction.payload],
      };
    }

    case Actions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.slice(0, state.editedIngredientIndex),
          ...state.ingredients.slice(state.editedIngredientIndex + 1),
        ],
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    case Actions.UPDATE_INGREDIENT: {
      const updateAction = action as Actions.UpdateIngredient;

      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient,
        ...updateAction.payload,
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    }

    case Actions.START_EDIT: {
      const startAction = action as Actions.StartEdit;
      if (startAction.payload == null) return state;

      return {
        ...state,
        editedIngredient: { ...state.ingredients[startAction.payload] },
        editedIngredientIndex: startAction.payload,
      };
    }

    case Actions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    default:
      return state;
  }
}
