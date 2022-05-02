import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable({ providedIn: "root" })
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  //   private recipes: Recipe[] = [
  //     new Recipe(
  //       "Tasty Schnitzel",
  //       "A super-tasty Schnitzel - just awesome!",
  //       "https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG",
  //       [new Ingredient("Meat", 1), new Ingredient("French Fries", 20)]
  //     ),
  //     new Recipe(
  //       "Big Fat Burger",
  //       "What else you need to say?",
  //       "https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg",
  //       [new Ingredient("Buns", 2), new Ingredient("Meat", 1)]
  //     ),
  //   ];
  private recipes: Recipe[] = [];

  constructor(private readonly slService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(index: number): Recipe {
    return this.recipes[index];
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe): void {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
