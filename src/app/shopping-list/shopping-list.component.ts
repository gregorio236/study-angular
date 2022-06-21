import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import * as fromApp from "../store/app.reducer";
import * as fromShoppingList from "./store/shopping-list.reducer";

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private readonly store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.ingredients = this.store.select("shoppingList");
  }

  onEditItem(index: number): void {
    this.store.dispatch(fromShoppingList.Actions.startEdit({ index }));
  }
}
