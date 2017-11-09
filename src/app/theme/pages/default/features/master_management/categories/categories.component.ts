import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { Pipe, PipeTransform } from '@angular/core';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { CategoriesService } from '../../../_services/categories.service';
import { Categories } from "../../../_models/categories";


@Component({
  selector: "app-users-list",
  templateUrl: "./categories.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class CategoriesComponent implements OnInit {
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
    this.router.navigate(['/features/masterManagement/categories/add']);
  }

  onManageCategoryClick(data: Categories) {
    this.router.navigate(['/features/masterManagement/categories/edit', data.id]);
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
