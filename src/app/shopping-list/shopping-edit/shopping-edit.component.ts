import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";

import { Ingredient } from "src/app/shared/ingredient.model";
import * as fromApp from "src/app/store/app.reducer";
import * as fromShoppingList from "../store/shopping-list.reducer";

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false }) slForm: NgForm;
  editMode = false;
  editedItem: Ingredient;

  constructor(private readonly store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select("shoppingList").subscribe((state) => {
      if (state.editedIngredientIndex < 0 || state.editedIngredient == null) {
        this.editMode = false;
        return;
      }

      this.editMode = true;
      this.editedItem = state.editedIngredient;
      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount,
      });
    });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(
        fromShoppingList.Actions.updateIngredient({ ingredient: newIngredient })
      );
    } else {
      this.store.dispatch(
        fromShoppingList.Actions.addIngredient({ ingredient: newIngredient })
      );
    }
    this.editMode = false;
    form.reset();
  }

  onClear(): void {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(fromShoppingList.Actions.stopEdit());
  }

  onDelete(): void {
    this.store.dispatch(fromShoppingList.Actions.deleteIngredient());
    this.onClear();
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromShoppingList.Actions.stopEdit());
  }
}
