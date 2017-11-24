import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash/index';

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

    this.feesForm = this.formBuilder.group({
      id: [],
      frequencyId: ['', [Validators.required]],
      feeHeadName: ['', [Validators.required]],
      feeHeadDescription: [''],
      chargeHeadName: ['', [Validators.required]],
    });

    this.route.params.forEach((params: Params) => {
      this.params = params['feeId'];
    });

    this.chargeHeaderList = [];
    this.frequencyIdList = [];
    let list = this.commonService.getChargeHeader();
    let url = '?&filter[where][schoolId]=' + localStorage.getItem('schoolId');
    Observable.forkJoin([this.frequencyService.getAllFrequency(), this.feesService.getAllFeesList(url)])
      .subscribe((response) => {
        if (response[0] && response[0].length > 0) {
          response[0].forEach(item => {
            this.frequencyIdList.push({ label: item.frequencyName, value: item.id });
          });
        }
        if (!this.params) {
          if (response[1] && response[1].length > 0) {
            for (var index = 0; index < list.length; index++) {
              let chargeHead = _.filter(response[1], function (item) {
                return item.chargeHeadName.toLowerCase() == list[index].toLowerCase();
              });
              if (chargeHead == 0) {
                this.chargeHeaderList.push({ label: list[index], value: list[index] });
              }
            }
          } else {
            for (var index = 0; index < list.length; index++) {
              this.chargeHeaderList.push({ label: list[index], value: list[index] });
            }
          }
        } else {
          this.feesService.getFeeById(this.params)
            .subscribe((results: Fees) => {
              if (response[1] && response[1].length > 0) {
                for (var index = 0; index < list.length; index++) {
                  let chargeHead = _.filter(response[1], function (item) {
                    return item.chargeHeadName.toLowerCase() == list[index].toLowerCase();
                  });
                  if (chargeHead.length == 0 || list[index].toLowerCase() == results.chargeHeadName.toLowerCase()) {
                    this.chargeHeaderList.push({ label: list[index], value: list[index] });
                  }
                }
              } else {
                for (var index = 0; index < list.length; index++) {
                  this.chargeHeaderList.push({ label: list[index], value: list[index] });
                }
              }

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
