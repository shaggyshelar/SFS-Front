import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { FeesService } from '../../../../_services/fees.service';
import { Fees } from "../../../../_models/fees";
import { Pipe, PipeTransform } from '@angular/core';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { AcademicYear, FeePlan, FeePlanDetails } from '../../../../_models/index';
import { AcademicYearService } from '../../../../_services/index';
import * as _ from 'lodash/index';

@Component({
  selector: "app-users-list",
  templateUrl: "./fees-plan-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class FeesPlanAddEditComponent implements OnInit {
  staticFeeHeadList = [];
  params: number;
  feeHeadList = [];
  academicYearList = [];
  sequenceNumberArr = [];
  feePlanDetails = [];
  selectedAcademicYear: string;
  maxsequenceNumber: number;
  academicYearRange: string;
  planeName: '';
  planeDesc: '';
  minDate: Date;
  maxDate: Date;
  frequency = [{
    sequenceNumber: 1,
    date: Date
  }];
  feePlanManagement = [{
    feeHeadList: [],
    feeHeadId: 0,
    amount: '',
    confirmAmount: '',
  }];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private academicYearService: AcademicYearService,
    private feesService: FeesService,
    private globalErrorHandler: GlobalErrorHandler,
    private messageService: MessageService) {
  }
  ngOnInit() {
    this.getAcademicYear();
    this.checkForEdit();
  }

  checkForEdit() {
    this.route.params.forEach((params: Params) => {
      this.params = params['feeId'];
      if (this.params) {
        this.feesService.getFeePlanById(this.params)
          .subscribe((results: any) => {
            this.planeName = results.feePlanName;
            this.planeDesc = results.feePlanDescription;
          }, error => {
            this.globalErrorHandler.handleError(error);
          })
      }
    });
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
    for (let index = 0; index < this.maxsequenceNumber; index++) {
      let newObj = {
        sequenceNumber: index,
        date: new Date()
      }
      this.calculateDate(this.maxsequenceNumber, index, newObj);
    }
  }

  calculateDate(maxsequenceNumber, index, obj) {
    if (maxsequenceNumber == 1) {
      obj.date = this.minDate;
    }
    else if (maxsequenceNumber == 2) {
      if (index == 0)
        obj.date = this.minDate;
      else
        obj.date = new Date(new Date(this.minDate).setMonth(this.minDate.getMonth() + 6));
    }
    else if (maxsequenceNumber == 4) {
      if (index == 0)
        obj.date = this.minDate;
      else if (index == 1)
        obj.date = new Date(new Date(this.minDate).setMonth(this.minDate.getMonth() + 3));
      else if (index == 2)
        obj.date = new Date(new Date(this.minDate).setMonth(this.minDate.getMonth() + 6));
      else if (index == 3)
        obj.date = new Date(new Date(this.minDate).setMonth(this.minDate.getMonth() + 9));
    }
    else if (maxsequenceNumber == 12) {
      obj.date = new Date(new Date(this.minDate).setMonth(this.minDate.getMonth() + index));
    }
    this.frequency.push(obj);
  }

  onAcademicYearChange() {
    let tempYear = _.find(this.academicYearList, { 'value': this.selectedAcademicYear });
    this.minDate = new Date(tempYear.startDate);
    this.maxDate = new Date(tempYear.endDate);
    this.academicYearRange = this.maxDate.getFullYear() + ':' + (this.maxDate.getFullYear());
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
      this.getAllFees();
      // this.academicYearList.push({ label: '--Select--', value: 'select' });
      for (let key in response) {
        if (response.hasOwnProperty(key)) {
          this.academicYearList.push({ label: response[key].academicYear, value: response[key].academicYear, startDate: response[key].startDate, endDate: response[key].endDate });
        }
      }
    });
  }

  onSubmit(form) {
    if (form.valid) {
      let _feeplan = new FeePlan();
      _feeplan.feePlanName = this.planeName;
      _feeplan.feePlanDescription = this.planeDesc;
      _feeplan.schoolId = parseInt(localStorage.getItem('schoolId'));
      this.feesService.createFeePlan(_feeplan)
        .subscribe(
        results => {
          //this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
          _feeplan = results;
          this.saveFeePlanDetails(_feeplan);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }

  saveFeePlanDetails(_feeplan: FeePlan) {
    let _staticFeeHeadList = this.staticFeeHeadList;
    let _selectedAcademicYear = this.selectedAcademicYear;
    let _frequency = this.frequency;
    let _feePlanDetails = this.feePlanDetails;
    _.forEach(this.feePlanManagement, function (value) {
      let tempFeeHead = _.find(_staticFeeHeadList, { 'value': value.feeHeadId });
      for (let index = 0; index < tempFeeHead.frequencyValue; index++) {
        let feePlanDetailObj = new FeePlanDetails();
        feePlanDetailObj.feePlanId = _feeplan.id;
        feePlanDetailObj.sequenceNumber = index + 1;
        feePlanDetailObj.feeHeadId = value.feeHeadId;
        feePlanDetailObj.academicYear = _selectedAcademicYear;
        feePlanDetailObj.feeCharges=value.amount;
        if (tempFeeHead.frequencyValue == 1)
          feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
        else if (tempFeeHead.frequencyValue == 2) {
          if (index == 1)
            feePlanDetailObj.dueDate = new Date(_frequency[6].date.toString());
          else
            feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
        }
        else if (tempFeeHead.frequencyValue == 4) {
          if (index == 0)
            feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
          else if (index == 1)
            feePlanDetailObj.dueDate = new Date(_frequency[3].date.toString());
          else if (index == 2)
            feePlanDetailObj.dueDate = new Date(_frequency[6].date.toString());
          else if (index == 3)
            feePlanDetailObj.dueDate = new Date(_frequency[9].date.toString());
        }
        else if (tempFeeHead.frequencyValue == 12) {
          feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
        }
        _feePlanDetails.push(feePlanDetailObj);
      }
    });
    this.feesService.createFeeplanheaddetails(_feePlanDetails)
      .subscribe(
      results => {
        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Created Successfully' });

      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
    console.log(_feePlanDetails);
  }

}
