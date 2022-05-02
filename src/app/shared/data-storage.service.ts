import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private readonly http: HttpClient,
    private readonly recipesServices: RecipeService
  ) {}

  saveRecipes(): void {
    const recipes = this.recipesServices.getRecipes();

    this.http
      .put(
        "https://study-angular-a520d-default-rtdb.firebaseio.com/recipes.json",
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(
        "https://study-angular-a520d-default-rtdb.firebaseio.com/recipes.json"
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            const { name, description, imagePath, ingredients } = recipe;
            return new Recipe(
              name,
              description,
              imagePath,
              ingredients != null ? ingredients : []
            );
          });
        }),
        tap((recipes) => {
          this.recipesServices.setRecipes(recipes);
        })
      );
  }
}
