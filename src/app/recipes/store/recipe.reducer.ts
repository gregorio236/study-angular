import { iif } from "rxjs";
import { Recipe } from "../recipe.model";
import * as Actions from "./recipe.actions";

export * as Actions from "./recipe.actions";

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function recipeReducer(
  state: State | undefined,
  action: Actions.RecipeActions
): State {
  if (state == null) state = initialState;

  switch (action.type) {
    case Actions.ADD_RECIPE: {
      const addAction = action as Actions.AddRecipe;
      if (addAction.payload == null) return state;

      return {
        ...state,
        recipes: [...state.recipes, addAction.payload],
      };
    }

    case Actions.DELETE_RECIPE: {
      const deleteAction = action as Actions.DeleteRecipe;
      if (deleteAction.payload == null) return state;

      return {
        ...state,
        recipes: state.recipes.filter(
          (recipe, index) => deleteAction.payload !== index
        ),
      };
    }

    case Actions.SET_RECIPES: {
      const setAction = action as Actions.SetRecipes;
      if (setAction.payload == null) return state;

      return {
        ...state,
        recipes: [...setAction.payload],
      };
    }

    case Actions.UPDATE_RECIPE: {
      const updateAction = action as Actions.UpdateRecipe;
      if (updateAction.payload == null) return state;

      const updatedRecipe = {
        ...state.recipes[updateAction.payload.index],
        ...updateAction.payload.newRecipe,
      };

      const updatedRecipes = [...state.recipes];
      updatedRecipes[updateAction.payload.index] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes,
      };
    }

    default:
      return state;
  }
}
