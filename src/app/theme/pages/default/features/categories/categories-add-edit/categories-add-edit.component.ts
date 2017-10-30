import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoriesService } from '../../../_services/categories.service';
import { Categories } from "../../../_models/categories";
import { Observable } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

@Component({
  selector: "app-users-list",
  templateUrl: "./categories-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  categoriesForm: FormGroup;
  schools: SelectItem[];
  categories: SelectItem[];
  constructor(
    private formBuilder: FormBuilder, private categorieslService: CategoriesService,
    private route: ActivatedRoute, private router: Router, private messageService: MessageService, private globalErrorHandler: GlobalErrorHandler
  ) {
  }

  ngOnInit() {

    this.schools = [];
    this.schools.push({ label: 'Select', value: null });
    this.schools.push({ label: 'School1', value: "1" });
    this.schools.push({ label: 'School2', value: "2" });

    this.categories = [];
    this.categories.push({ label: 'Select', value: null });
    this.categories.push({ label: 'Category1', value: "1" });
    this.categories.push({ label: 'Category2', value: "2" });

    this.categoriesForm = this.formBuilder.group({
      id: [],
      SchoolId: [0, [Validators.required]],
      CategoryId: [0, [Validators.required]],
      CategoryName: ['', [Validators.required]],
      CategoryDescription: ['', [Validators.required]],
    });

    this.route.params.forEach((params: Params) => {
      this.params = params['categoriesId'];
      if (this.params) {
        this.categorieslService.getCategoryById(this.params)
          .subscribe((results: Categories) => {
            this.categoriesForm.setValue({
              CategoryId: results.CategoryId,
              SchoolId: results.SchoolId,
              CategoryName: results.CategoryName,
              CategoryDescription: results.CategoryDescription,
              id: results.id
            });
          })
      }
    });
  }

  onSubmit({ value, valid }: { value: Categories, valid: boolean }) {
    if (this.params) {
      this.categorieslService.updateCategory(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
          this.router.navigate(['/features/categories/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    } else {
      this.categorieslService.createCategory(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
          this.router.navigate(['/features/categories/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }
  onCancel() {
    this.router.navigate(['/features/categories/list']);
  }
}
