import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: "app-users-list",
  templateUrl: "./school-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class SchoolAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  schoolForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router
  ) {
  }

  ngOnInit() {
    this.schoolForm = this.formBuilder.group({
      ID: [0],
      SchoolName: ['', [Validators.required]],
      SchoolEmail: ['', [Validators.required]],
      SchoolPhone: ['', [Validators.required]],
      SchoolAddress: ['', [Validators.required]],
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
      this.router.navigate(['/features/school/list']);
    } else {
      this.router.navigate(['/features/school/list']);
    }
  }
  onCancel() {
    this.router.navigate(['/features/school/list']);
  }
}

