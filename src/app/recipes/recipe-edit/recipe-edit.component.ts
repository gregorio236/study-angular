import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Subscription } from "rxjs";

import * as fromApp from "src/app/store/app.reducer";
import * as fromRecipe from "../store/recipe.reducer";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnDestroy, OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSubscription: Subscription | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store<fromApp.AppState>
  ) {}

  get formIngredients(): FormArray {
    return this.recipeForm.get("ingredients") as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.editMode = params["id"] != null;
      this.initForm();
    });
  }

  ngOnDestroy(): void {
    if (this.storeSubscription != null) this.storeSubscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.editMode) {
      this.store.dispatch(
        fromRecipe.Actions.updateRecipe({
          index: this.id,
          newRecipe: this.recipeForm.value,
        })
      );
    } else {
      this.store.dispatch(
        fromRecipe.Actions.addRecipe({ recipe: this.recipeForm.value })
      );
    }
    this.onCancel();
  }

  onAddIngredient(): void {
    this.formIngredients.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onDeleteIngredient(index: number): void {
    this.formIngredients.removeAt(index);
  }

  onCancel(): void {
    void this.router.navigate(["../"], { relativeTo: this.route });
  }

  private initForm(): void {
    let recipeName = "";
    let recipeImagePath = "";
    let recipeDescription = "";
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSubscription = this.store
        .select("recipes")
        .pipe(
          map((recipeState) =>
            recipeState.recipes.find((recipe, index) => index === this.id)
          )
        )
        .subscribe((recipe) => {
          if (recipe == null) return;

          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe.ingredients != null) {
            for (const ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }
}
