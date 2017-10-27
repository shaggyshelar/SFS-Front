import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { CategoriesService } from '../../../_services/categories.service';
import { Categories } from "../../../_models/categories";

@Component({
  selector: "app-users-list",
  templateUrl: "./categories-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesListComponent implements OnInit {
  categoriesList: Observable<Categories[]>;
  constructor(private CategoriesService: CategoriesService, private router: Router) {
  }

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesList = this.CategoriesService.getAllCategories();
  }

  onAddCategory() {
    this.router.navigate(['/features/categories/add']);
  }

  onManageCategoryClick(data: Categories) {
    debugger;
    this.router.navigate(['/features/categories/edit', data.id]);
  }
  onCategoryDeleteClick(data: Categories) {
    debugger;
    this.CategoriesService.deleteCategory(data.id).subscribe((results: any) => {
      this.getAllCategories();
    })
  }

}
