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
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRecipe.Actions.fetchRecipes),
      switchMap(() =>
        this.http.get<Recipe[]>(
          "https://study-angular-a520d-default-rtdb.firebaseio.com/recipes.json"
        )
      ),
      map((recipes) =>
        recipes.map(
          (recipe) =>
            new Recipe(
              recipe.name,
              recipe.description,
              recipe.imagePath,
              recipe.ingredients != null ? recipe.ingredients : []
            )
        )
      ),
      map((recipes) => fromRecipe.Actions.setRecipes({ recipes }))
    )
  );

  storeRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromRecipe.Actions.storeRecipes),
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
