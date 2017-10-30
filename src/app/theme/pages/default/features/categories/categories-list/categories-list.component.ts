import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { CategoriesService } from '../../../_services/categories.service';
import { Categories } from "../../../_models/categories";
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

@Component({
  selector: "app-users-list",
  templateUrl: "./categories-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesListComponent implements OnInit {
  categoriesList: Observable<Categories[]>;
  constructor(
    private CategoriesService: CategoriesService, 
    private router: Router, 
    private globalErrorHandler: GlobalErrorHandler, 
    private messageService: MessageService) {
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
    this.CategoriesService.deleteCategory(data.id)
      .subscribe(
      results => {
        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
        this.getAllCategories();
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
}
