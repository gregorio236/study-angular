import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, switchMap } from "rxjs";

import * as fromShoppingList from "src/app/shopping-list/store/shopping-list.reducer";
import * as fromApp from "src/app/store/app.reducer";
import { Recipe } from "../recipe.model";
import * as fromRecipe from "../store/recipe.reducer";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => +params["id"]),
        switchMap((id) => {
          this.id = id;
          return this.store.select("recipes");
        }),
        map((recipeState) => {
          return recipeState.recipes.find((recipe, index) => index === this.id);
        })
      )
      .subscribe((recipe) => {
        if (recipe != null) this.recipe = recipe;
      });
  }

  onAddToShoppingList(): void {
    this.store.dispatch(
      fromShoppingList.Actions.addIngredients({
        ingredients: this.recipe.ingredients,
      })
    );
  }

  onEditRecipe(): void {
    void this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteRecipe(): void {
    this.store.dispatch(fromRecipe.Actions.deleteRecipe({ index: this.id }));
    void this.router.navigate(["/recipes"]);
  }
}
