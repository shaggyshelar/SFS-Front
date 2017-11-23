import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { FeesService } from '../../../../_services/fees.service';
import { Fees } from "../../../../_models/fees";
import { Pipe, PipeTransform } from '@angular/core';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { AcademicYear } from '../../../../_models/index';
import { AcademicYearService } from '../../../../_services/index';
import * as _ from 'lodash/index';

@Component({
  selector: "app-users-list",
  templateUrl: "./fees-plan-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class FeesPlanAddEditComponent implements OnInit {
  staticFeeHeadList = [];
  feeHeadList = [];
  academicYearList = [];
  sequenceNumberArr = [];
  selectedAcademicYear: string;
  maxsequenceNumber: number;
  academicYearRange: string;
  minDate:Date;
  maxDate:Date;
  frequency = [{
    sequenceNumber: 1,
    date: ''
  }];
  feePlanManagement = [{
    feeHeadList: [],
    feeHeadId: 0,
    amount: '',
    confirmAmount: '',
  }];
  constructor(private router: Router, private academicYearService: AcademicYearService, private feesService: FeesService, private globalErrorHandler: GlobalErrorHandler, private messageService: MessageService) {
  }
  ngOnInit() {
    this.getAllFees();
    this.getAcademicYear();
  }

  getAllFees() {
    let feeheads = this.feesService.getAllFees();
    feeheads.subscribe((response) => {
      // this.staticFeeHeadList = response;
      this.feeHeadList.push({ label: '--Select--', value: '0' });
      this.staticFeeHeadList.push({ label: '--Select--', value: '0' });
      for (let key in response) {
        if (response.hasOwnProperty(key)) {
          this.staticFeeHeadList.push({ label: response[key].feeHeadName, value: response[key].id, frequencyValue: response[key].FeeheadsFrequency.frequencyValue });
          this.feeHeadList.push({ label: response[key].feeHeadName, value: response[key].id });
        }
      }
      this.feePlanManagement[0].feeHeadList = this.feeHeadList;
    },
      error => {
        this.globalErrorHandler.handleError(error);
      }
    );
  }

  onFeeHeadChange(record, index) {
    let tempFeeHead = _.find(this.staticFeeHeadList, { 'value': record.feeHeadId });
    this.sequenceNumberArr[index] = tempFeeHead.frequencyValue;
    this.maxsequenceNumber = _.max(this.sequenceNumberArr);
    this.frequency = [];
    for (let index = 1; index <= this.maxsequenceNumber; index++) {
      this.frequency.push({
        sequenceNumber: index,
        date: ''
      });
    }
  }
  onAcademicYearChange() {
    let tempYear = _.find(this.academicYearList, { 'value': this.selectedAcademicYear});
    this.minDate=new Date(tempYear.startDate);
    this.maxDate=new Date(tempYear.endDate);
    this.academicYearRange=this.maxDate.getFullYear()+':'+(this.maxDate.getFullYear()+1);
  }

  removeFeeHeadDetails(item, rowNum) {
    this.feePlanManagement.splice(rowNum, 1);
  }

  addFeeHeadDetails(feeItem) {
    if (feeItem.feeHeadId == 0 || feeItem.feeHeadId == '') {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select Fee Head' });
      return false;
    }
    if (!feeItem.amount) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Enter Amount' });
      return false;
    }
    if (feeItem.amount != feeItem.confirmAmount) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Check Re-enter Amount' });
      return false;
    }
    let _feePlanManagement = this.feePlanManagement;
    let _staticFeeHeadList = this.staticFeeHeadList;
    let newHeadList = _.filter(_staticFeeHeadList, function (item) {
      return _.findIndex(_feePlanManagement, { 'feeHeadId': item.value }) === -1;
    });

    this.feePlanManagement.push({
      feeHeadList: newHeadList,
      feeHeadId: 0,
      amount: '',
      confirmAmount: '',
    })
  }

  getAcademicYear() {
    let academicYears = this.academicYearService.getAllAcademicYears();
    academicYears.subscribe((response) => {
      // this.academicYearList.push({ label: '--Select--', value: 'select' });
      for (let key in response) {
        if (response.hasOwnProperty(key)) {
          this.academicYearList.push({ label: response[key].academicYear, value: response[key].academicYear, startDate: response[key].startDate, endDate: response[key].endDate });
        }
      }
    });
  }


}
