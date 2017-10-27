import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FeesService } from '../../../_services/fees.service';
import { Fees } from "../../../_models/fees";
import { Observable } from 'rxjs/Rx';

import { SelectItem } from 'primeng/primeng';

@Component({
  selector: "app-users-list",
  templateUrl: "./fees-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FeesAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  feesForm: FormGroup;
  feeHeadIdList: SelectItem[];
  schoolIdList: SelectItem[];
  frequencyIdList: SelectItem[];
  isAddHocList: SelectItem[];
  standardIdList: SelectItem[];
  categoryIdList: SelectItem[];
  isApprovedList: SelectItem[];
  currencyIdList: SelectItem[];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router,
    private feesService: FeesService
  ) {
  }

  ngOnInit() {


    this.feeHeadIdList = [];
    this.feeHeadIdList.push({ label: 'Select', value: null });
    this.feeHeadIdList.push({ label: 'FeeHeads1', value: "1" });
    this.feeHeadIdList.push({ label: 'FeeHeads2', value: "2" });

    this.schoolIdList = [];
    this.schoolIdList.push({ label: 'Select', value: null });
    this.schoolIdList.push({ label: 'School1', value: "1" });
    this.schoolIdList.push({ label: 'School2', value: "2" });

    this.frequencyIdList = [];
    this.frequencyIdList.push({ label: 'Select', value: null });
    this.frequencyIdList.push({ label: 'Feequency1', value: "1" });
    this.frequencyIdList.push({ label: 'Feequency2', value: "2" });

    this.isAddHocList = [];
    this.isAddHocList.push({ label: 'Yes', value: true });
    this.isAddHocList.push({ label: 'No', value: false });

    this.standardIdList = [];
    this.standardIdList.push({ label: 'Select', value: null });
    this.standardIdList.push({ label: 'Standard1', value: "1" });
    this.standardIdList.push({ label: 'Standard2', value: "2" });

    this.categoryIdList = [];
    this.categoryIdList.push({ label: 'Select', value: null });
    this.categoryIdList.push({ label: 'Category1', value: "1" });
    this.categoryIdList.push({ label: 'Category2', value: "2" });

    this.isApprovedList = [];
    this.isApprovedList.push({ label: 'Yes', value: true });
    this.isApprovedList.push({ label: 'No', value: false });

    this.currencyIdList = [];
    this.currencyIdList.push({ label: 'Select', value: null });
    this.currencyIdList.push({ label: 'Currency1', value: "1" });
    this.currencyIdList.push({ label: 'Currency2', value: "2" });

    this.feesForm = this.formBuilder.group({
      id: [],
      FeeHeadId: ['', [Validators.required]],
      SchoolId: ['', [Validators.required]],
      FrequencyId: ['', [Validators.required]],
      FeeHeadCharges: [0, [Validators.required]],
      IsAddHoc: ['', [Validators.required]],
      StandardId: ['', [Validators.required]],
      CategoryId: ['', [Validators.required]],
      IsApproved: ['', [Validators.required]],
      IsApprovedBy: ['', [Validators.required]],
      CurrencyId: ['', [Validators.required]],
    });

    this.route.params.forEach((params: Params) => {
      this.params = params['feeId'];
      if (this.params) {
        this.feesService.getFeeById(this.params)
          .subscribe((results: Fees) => {
            this.feesForm.setValue({
              FeeHeadId: results.FeeHeadId,
              SchoolId: results.SchoolId,
              FrequencyId: results.FrequencyId,
              FeeHeadCharges: results.FeeHeadCharges,
              IsAddHoc: results.IsAddHoc,
              StandardId: results.StandardId,
              CategoryId: results.CategoryId,
              IsApproved: results.IsApproved,
              IsApprovedBy: results.IsApprovedBy,
              CurrencyId: results.CurrencyId,
              id: results.id
            });
          })
      }
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (this.params) {
      this.feesService.updateFees(value)
        .subscribe(
        results => {
          this.router.navigate(['/features/fees/list']);
        },
        error => this.errorMessage = <any>error);
    } else {
      this.feesService.createFees(value)
        .subscribe(
        results => {
          this.router.navigate(['/features/fees/list']);
        },
        error => this.errorMessage = <any>error);
    }
  }
  onCancel() {
    this.router.navigate(['/features/fees/list']);
  }
}
