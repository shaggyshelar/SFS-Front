import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: "app-users-list",
  templateUrl: "./categories-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  categoriesForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router
  ) {
  }

  ngOnInit() {
    this.categoriesForm = this.formBuilder.group({
      ID: [0],
      CategoryName: ['', [Validators.required]],
      CategoryDescription: ['', [Validators.required]],
    });
    // this.route.params.forEach((params: Params) => {
    //   this.params = params['roleId'];
    //   if (this.params) {
    //     this.schoolForm.setValue({
    //       ID: 1,
    //       Name: 'SuperAdmin',
    //     });
    //   }
    // });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (this.params) {
      this.router.navigate(['/features/categories/list']);
    } else {
      this.router.navigate(['/features/categories/list']);
    }
  }
  onCancel() {
    this.router.navigate(['/features/categories/list']);
  }
}
