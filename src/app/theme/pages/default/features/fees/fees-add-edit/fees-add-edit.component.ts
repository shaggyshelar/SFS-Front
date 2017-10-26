import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: "app-users-list",
  templateUrl: "./fees-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FeesAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  feesForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router
  ) {
  }

  ngOnInit() {
    this.feesForm = this.formBuilder.group({
      ID: [0],
      FeeHeadName: ['', [Validators.required]],
      FeeHeadCharges: ['', [Validators.required]]
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (this.params) {
      this.router.navigate(['/features/fees/list']);
    } else {
      this.router.navigate(['/features/fees/list']);
    }
  }
  onCancel() {
    this.router.navigate(['/features/fees/list']);
  }
}
