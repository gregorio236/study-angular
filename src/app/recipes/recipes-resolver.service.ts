import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, Observable, of, switchMap, take } from "rxjs";

import * as fromApp from "../store/app.reducer";
import { Recipe } from "./recipe.model";
import * as fromRecipe from "./store/recipe.reducer";

@Injectable({ providedIn: "root" })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private readonly store: Store<fromApp.AppState>,
    private readonly actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    return this.store.select("recipes").pipe(
      take(1),
      map((recipesState) => recipesState.recipes),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this.store.dispatch(fromRecipe.Actions.fetchRecipes());
          return this.actions$.pipe(
            ofType(fromRecipe.Actions.setRecipes),
            take(1),
            map((action) => {
              return action.recipes;
            })
          );
        }

        return of(recipes);
      })
    );
  }
}
