import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FeesService } from '../../../../_services/fees.service';
import { Fees } from "../../../../_models/fees";
import { Observable } from 'rxjs/Rx';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { FrequencyService } from '../../../../_services/frequency.service';
import { CommonService } from '../../../../_services/common.service';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: "app-users-list",
  templateUrl: "./fees-head-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FeesHeadAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  feesForm: FormGroup;
  frequencyIdList: SelectItem[];
  chargeHeaderList: SelectItem[];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router,
    private feesService: FeesService,
    private messageService: MessageService,
    private globalErrorHandler: GlobalErrorHandler,
    private frequencyService: FrequencyService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit() {

    if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
    }
    this.frequencyIdList = [];
    let val = this.frequencyService.getAllFrequency();
    val.subscribe((response) => {
      for (let key in response) {
        if (response.hasOwnProperty(key)) {
          this.frequencyIdList.push({ label: response[key].frequencyName, value: response[key].id });
        }
      }
    });

    let list = this.commonService.getChargeHeader();
    this.chargeHeaderList = [];

    for (var index = 0; index < list.length; index++) {
      this.chargeHeaderList.push({ label: list[index], value: list[index] });
    }



    this.feesForm = this.formBuilder.group({
      id: [],
      frequencyId: ['', [Validators.required]],
      feeHeadName: ['', [Validators.required]],
      feeHeadDescription: ['', [Validators.required]],
      chargeHeadName: ['', [Validators.required]],
    });

    this.route.params.forEach((params: Params) => {
      this.params = params['feeId'];
      if (this.params) {
        this.feesService.getFeeById(this.params)
          .subscribe((results: Fees) => {
            this.feesForm.setValue({
              id: results.id,
              frequencyId: results.frequencyId,
              feeHeadName: results.feeHeadName,
              feeHeadDescription: results.feeHeadDescription,
              chargeHeadName: results.chargeHeadName,
            });
          })
      }
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (this.params) {
      value.schoolId = localStorage.getItem("schoolId");
      this.feesService.updateFees(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
          this.router.navigate(['/features/fees/feesHead/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    } else {
      if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
        this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
      } else {
        value.schoolId = localStorage.getItem("schoolId");
        this.feesService.createFees(value)
          .subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
            this.router.navigate(['/features/fees/feesHead/list']);
          },
          error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
  }
  onCancel() {
    this.router.navigate(['/features/fees/feesHead/list']);
  }
}
