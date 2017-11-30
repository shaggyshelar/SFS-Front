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
import { SchoolService } from '../../../../_services/index';
import { Helpers } from "../../../../../../../helpers";
import * as _ from 'lodash/index';
import { retry } from 'rxjs/operator/retry';

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
  paymentProcessDate: number;
  academicYearRange: string;
  isTransactionProcessed: boolean;
  planeName: '';
  planeDesc: '';
  minDate: Date;
  maxDate: Date;
  frequency = [{
    sequenceNumber: 1,
    date: new Date()
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
    private schoolService: SchoolService,
    private feesService: FeesService,
    private globalErrorHandler: GlobalErrorHandler,
    private messageService: MessageService) {
  }
  ngOnInit() {
    Helpers.setLoading(true);
    this.minDate = new Date();
    this.maxDate = new Date();
    this.getSchoolDetails();
  }

  getSchoolDetails() {
    let schoolId = parseInt(localStorage.getItem('schoolId'));
    this.schoolService.getSchoolById(schoolId).subscribe((response) => {
      this.paymentProcessDate = parseInt(response.processingDate);
      this.getAcademicYear();
    },
      error => {
        this.globalErrorHandler.handleError(error);
      }
    );
  }

  checkForEdit() {
    Helpers.setLoading(true);
    this.route.params.forEach((params: Params) => {
      this.params = params['feeId'];
      if (this.params) {
        this.feesService.getFeePlanById(this.params)
          .subscribe((results: any) => {
            let index = 0;
            this.planeName = results.feePlanName;
            this.planeDesc = results.feePlanDescription;
            this.feePlanManagement = [];
            let uniqFeeHead = _.uniqBy(results.FeePlanDetails, 'feeHeadId');
            this.isTransactionProcessed = results.isTransactionProcessed;
            if (uniqFeeHead.length > 0) {
              this.selectedAcademicYear = results.academicYear;
              this.onAcademicYearChange();
            }
            for (let feeheadIndex = 0; feeheadIndex < uniqFeeHead.length; feeheadIndex++) {
              this.addFeeHeadOnEdit(uniqFeeHead[feeheadIndex]);
              this.onFeeHeadChange(uniqFeeHead[feeheadIndex], feeheadIndex);
            }
            Helpers.setLoading(false);
          }, error => {
            this.globalErrorHandler.handleError(error);
          })
      }
      else {
        Helpers.setLoading(false);
      }
    });
  }

  getAllFees() {
    let _filterQuery = '?&filter[where][schoolId]=' + localStorage.getItem("schoolId");
    let feeheads = this.feesService.getAllFeesList(_filterQuery);
    feeheads.subscribe((response) => {
      Helpers.setLoading(false);
      this.feeHeadList.push({ label: '--Select--', value: '0' });
      this.staticFeeHeadList.push({ label: '--Select--', value: '0' });
      for (let key in response) {
        if (response.hasOwnProperty(key)) {
          this.staticFeeHeadList.push({ label: response[key].feeHeadName, value: response[key].id, frequencyValue: response[key].FeeheadsFrequency.frequencyValue });
          this.feeHeadList.push({ label: response[key].feeHeadName, value: response[key].id });
        }
      }
      this.feePlanManagement[0].feeHeadList = this.feeHeadList;
      this.checkForEdit();

    },
      error => {
        this.globalErrorHandler.handleError(error);
      }
    );
  }

  onFeeHeadChange(record, index) {
    // let tempFeeHead = _.find(this.staticFeeHeadList, { 'value': record.feeHeadId });
    // this.sequenceNumberArr[index] = tempFeeHead.frequencyValue;
    this.checkMaxSequenceNumber(index);

  }

  checkMaxSequenceNumber(index) {
    let vm = this;
    vm.sequenceNumberArr = [];
    _.forEach(this.feePlanManagement, function (record) {
      let tempFeeHead = _.find(vm.staticFeeHeadList, { 'value': record.feeHeadId });
      vm.sequenceNumberArr[index] = tempFeeHead.frequencyValue;
      index++;
    })
    vm.maxsequenceNumber = _.max(vm.sequenceNumberArr);
    vm.frequency = [];
    for (let index = 0; index < vm.maxsequenceNumber; index++) {
      let newObj = {
        sequenceNumber: index,
        date: new Date()
      }
      vm.calculateDate(vm.maxsequenceNumber, index, newObj);
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
    this.minDate = new Date(new Date(tempYear.startDate).setDate(this.paymentProcessDate));

    this.maxDate = new Date(tempYear.endDate);
    this.academicYearRange = this.maxDate.getFullYear() + ':' + (this.maxDate.getFullYear());
  }

  removeFeeHeadDetails(item, rowNum) {
    this.feePlanManagement.splice(rowNum, 1);
    this.checkMaxSequenceNumber(rowNum);
  }

  addFeeHeadDetails(feeItem) {
    if (!this.validateFeeHead(feeItem)) {
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

  validateFeeHead(feeItem) {

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
    return true;
  }

  addFeeHeadOnEdit(feeItem) {

    let _feePlanManagement = this.feePlanManagement;
    let _staticFeeHeadList = this.staticFeeHeadList;
    let newHeadList = _.filter(_staticFeeHeadList, function (item) {
      return _.findIndex(_feePlanManagement, { 'feeHeadId': item.value }) === -1;
    });

    this.feePlanManagement.push({
      feeHeadList: newHeadList,
      feeHeadId: feeItem.feeHeadId,
      amount: feeItem.feeCharges,
      confirmAmount: feeItem.feeCharges,
    })
  }


  getAcademicYear() {
    let academicYears = this.academicYearService.getAllAcademicYears();
    academicYears.subscribe((response) => {
      this.getAllFees();
      // this.academicYearList.push({ label: '--Select--', value: 'select' });
      this.academicYearList = response;
      let item = _.find(this.academicYearList, { isCurrent: true });
      if (item) {
        this.selectedAcademicYear = item.academicYear;
      }
    });
  }

  onSubmit(form) {
    if (form.valid) {
      let _vm = this;
      let _validateResult = true;
      _.forEach(this.feePlanManagement, function (value) {
        if (!_vm.validateFeeHead(value)) {
          _validateResult = false;
          return false;
        }
      });
      if (!_validateResult) {
        return false;
      }
      let _feeplan = new FeePlan();
      _feeplan.feePlanName = this.planeName;
      _feeplan.feePlanDescription = this.planeDesc;
      _feeplan.academicYear = this.selectedAcademicYear;
      _feeplan.schoolId = parseInt(localStorage.getItem('schoolId'));
      if (!this.params) {
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
      else {
        _feeplan.id = this.params;
        this.feesService.updateFeePlan(_feeplan)
          .subscribe(
          results => {
            _feeplan = results;
            this.feePlanDetails = [];
            this.saveFeePlanDetails(_feeplan);

          },
          error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
  }

  onCancelFeePlan() {
    this.router.navigate(['/features/fees/feesPlan/list']);
  }

  saveFeePlanDetails(_feeplan: FeePlan) {
    let _staticFeeHeadList = this.staticFeeHeadList;
    let _selectedAcademicYear = this.selectedAcademicYear;
    let _frequency = this.frequency;
    let _maxLength = this.frequency.length;
    let _feePlanDetails = this.feePlanDetails;
    let _vm = this;
    _.forEach(this.feePlanManagement, function (value) {
      let tempFeeHead = _.find(_staticFeeHeadList, { 'value': value.feeHeadId });
      for (let index = 0; index < tempFeeHead.frequencyValue; index++) {
        let feePlanDetailObj = new FeePlanDetails();
        feePlanDetailObj.feePlanId = _feeplan.id;
        feePlanDetailObj.sequenceNumber = index + 1;
        feePlanDetailObj.feeHeadId = value.feeHeadId;
        feePlanDetailObj.schoolId = parseInt(localStorage.getItem('schoolId'));
        feePlanDetailObj.academicYear = _selectedAcademicYear;
        feePlanDetailObj.feeCharges = value.amount;
        if (tempFeeHead.frequencyValue == 1)
          feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
        else if (tempFeeHead.frequencyValue == 2) {
          if (index == 1 && _maxLength == 12)
            feePlanDetailObj.dueDate = new Date(_frequency[6].date.toString());
          if (index == 1 && _maxLength == 4)
            feePlanDetailObj.dueDate = new Date(_frequency[2].date.toString());
          if (index == 1 && _maxLength == 2)
            feePlanDetailObj.dueDate = new Date(_frequency[1].date.toString());
          else
            feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
        }
        else if (tempFeeHead.frequencyValue == 4) {
          if (_maxLength == 4 || index == 0)
            feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
          else if (index == 1 && _maxLength == 12)
            feePlanDetailObj.dueDate = new Date(_frequency[3].date.toString());
          else if (index == 2 && _maxLength == 12)
            feePlanDetailObj.dueDate = new Date(_frequency[6].date.toString());
          else if (index == 3 && _maxLength == 12)
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
        if (this.params) {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
        }
        else {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Created Successfully' });
        }
        this.router.navigate(['/features/fees/feesPlan/list']);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });

  }

}
