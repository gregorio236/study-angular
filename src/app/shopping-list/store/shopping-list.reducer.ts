import { Action, createReducer, on } from "@ngrx/store";

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

const _shoppingListReducer = createReducer(
  initialState,

  on(Actions.addIngredient, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, action.ingredient],
  })),

  on(Actions.addIngredients, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, ...action.ingredients],
  })),

  on(Actions.deleteIngredient, (state) => ({
    ...state,
    ingredients: [
      ...state.ingredients.slice(0, state.editedIngredientIndex),
      ...state.ingredients.slice(state.editedIngredientIndex + 1),
    ],
    editedIngredient: null,
    editedIngredientIndex: -1,
  })),

  on(Actions.updateIngredient, (state, action) => {
    const ingredient = state.ingredients[state.editedIngredientIndex];
    const updatedIngredient = {
      ...ingredient,
      ...action.ingredient,
    };
    const updatedIngredients = [...state.ingredients];
    updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

    return {
      ...state,
      ingredients: updatedIngredients,
      editedIngredient: null,
      editedIngredientIndex: -1,
    };
  }),

  on(Actions.startEdit, (state, action) => ({
    ...state,
    editedIngredient: { ...state.ingredients[action.index] },
    editedIngredientIndex: action.index,
  })),

  on(Actions.stopEdit, (state) => ({
    ...state,
    editedIngredient: null,
    editedIngredientIndex: -1,
  }))
);

export function shoppingListReducer(state: State | undefined, action: Action) {
  return _shoppingListReducer(state, action);
}
