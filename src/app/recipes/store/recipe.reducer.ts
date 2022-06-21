import { Action, createReducer, on } from "@ngrx/store";

import { Recipe } from "../recipe.model";
import * as Actions from "./recipe.actions";

export * as Actions from "./recipe.actions";

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

const _recipeReducer = createReducer(
  initialState,

  on(Actions.addRecipe, (state, action) => ({
    ...state,
    recipes: [...state.recipes, action.recipe],
  })),

  on(Actions.deleteRecipe, (state, action) => ({
    ...state,
    recipes: state.recipes.filter((recipe, index) => action.index !== index),
  })),

  on(Actions.setRecipes, (state, action) => ({
    ...state,
    recipes: [...action.recipes],
  })),

  on(Actions.updateRecipe, (state, action) => {
    const updatedRecipe = {
      ...state.recipes[action.index],
      ...action.newRecipe,
    };

    const updatedRecipes = [...state.recipes];
    updatedRecipes[action.index] = updatedRecipe;

    return {
      ...state,
      recipes: updatedRecipes,
    };
  })
);

export function recipeReducer(state: State | undefined, action: Action) {
  return _recipeReducer(state, action);
}
