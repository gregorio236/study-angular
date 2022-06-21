import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs";

import * as fromApp from "src/app/store/app.reducer";
import { Recipe } from "../recipe.model";
import * as fromRecipe from "./recipe.reducer";

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRecipe.Actions.FETCH_RECIPES),
      switchMap(() =>
        this.http.get<Recipe[]>(
          "https://study-angular-a520d-default-rtdb.firebaseio.com/recipes.json"
        )
      ),
      map((recipes) =>
        recipes.map((recipe) => {
          const { name, description, imagePath, ingredients } = recipe;
          return new Recipe(
            name,
            description,
            imagePath,
            ingredients != null ? ingredients : []
          );
        })
      ),
      map((recipes) => new fromRecipe.Actions.SetRecipes(recipes))
    )
  );

  storeRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromRecipe.Actions.STORE_RECIPES),
        withLatestFrom(this.store.select("recipes")),
        switchMap(([actionData, recipesState]) => {
          return this.http.put(
            "https://study-angular-a520d-default-rtdb.firebaseio.com/recipes.json",
            recipesState.recipes
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly store: Store<fromApp.AppState>
  ) {}
}
