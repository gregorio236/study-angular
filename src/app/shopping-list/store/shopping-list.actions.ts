import { Action } from "@ngrx/store";

import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT: string = "ADD_INGREDIENT";
export const ADD_INGREDIENTS: string = "ADD_INGREDIENTS";
export const DELETE_INGREDIENT: string = "DELETE_INGREDIENT";
export const UPDATE_INGREDIENT: string = "UPDATE_INGREDIENT";
export const START_EDIT: string = "START_EDIT";
export const STOP_EDIT: string = "STOP_EDIT";

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;

  constructor(public payload?: Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;

  constructor(public payload?: Ingredient[]) {}
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;

  constructor(public payload?: Ingredient) {}
}

export class StartEdit implements Action {
  readonly type = START_EDIT;

  constructor(public payload?: number) {}
}

export class StopEdit implements Action {
  readonly type = STOP_EDIT;
}

export type ShoppingListActions =
  | AddIngredient
  | AddIngredients
  | StopEdit
  | DeleteIngredient
  | UpdateIngredient
  | StartEdit;
