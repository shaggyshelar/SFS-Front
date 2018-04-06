import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { FeesService } from '../../../../_services/fees.service';
import { Fees } from "../../../../_models/fees";
import { Pipe, PipeTransform } from '@angular/core';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { AcademicYear, FeePlan, FeePlanDetails } from '../../../../_models/index';
import { ConfirmationService } from 'primeng/primeng';
import { AcademicYearService } from '../../../../_services/index';
import { SchoolService } from '../../../../_services/index';
import { Helpers } from "../../../../../../../helpers";
import { StoreService } from "../../../../../../../_services/store.service";
import * as _ from 'lodash/index';
import { retry } from 'rxjs/operator/retry';

@Component({
  selector: "app-users-list",
  templateUrl: "./fees-plan-add-edit.component.html",
  encapsulation: ViewEncapsulation.None
})

export class FeesPlanAddEditComponent implements OnInit {
  previewVisible: boolean = false;
  feePlanPreviewDetails = [];
  feeHeadAmounts = [];
  totals = [];
  staticFeeHeadList = [];
  params: number;
  previewHeader: any = [];
  from: string;
  createdBy: String;
  updatedBy: String;
  verifiedBy: String;
  feeHeadList = [];
  skipQuarter = [];
  skipQuarterValue = 0;
  academicYearList = [];
  sequenceNumberArr = [];
  feePlanDetails = [];
  selectedAcademicYear: string;
  maxsequenceNumber: number;
  paymentProcessDate: number;
  academicYearRange: string;
  isTransactionProcessed: boolean;
  isVerified: boolean;
  planeName: '';
  planeDesc: '';
  minDate: Date;
  maxDate: Date;
  canVerify: boolean = false;
  frequency = [{
    sequenceNumber: 1,
    date: new Date()
  }];

  feePlanManagement = [{
    contRoleId: Math.floor(Math.random() * 2000),
    feeHeadList: [],
    frequencyName: '',
    feeHeadId: 0,
    amount: 0,
    confirmAmount: 0,
    name: '',
    skipQuarter: 0
  }];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private academicYearService: AcademicYearService,
    private schoolService: SchoolService,
    private feesService: FeesService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private storeService: StoreService,
    private messageService: MessageService) {
  }
  ngOnInit() {
    Helpers.setLoading(true);
    this.minDate = new Date();
    this.maxDate = new Date();
    this.skipQuarter = [{ label: '--Select--', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }];
    this.getSchoolDetails();
    this.checkPermission();

  }
  checkPermission() {
    let userHasPermissions = false;
    this.storeService.permissionsList.subscribe((response) => {
      if (response) {
        var permission = _.filter(response, { permissionName: 'VerifyFeePlan.Update' })[0];
        this.canVerify = permission ? true : false;
      }
    }, error => {
      console.log("Auth Fail");
    });

  }
  calculateDateForPreview() {
    this.previewHeader = [];
    switch (this.maxsequenceNumber) {
      case 12:
        var date = new Date(this.minDate);
        var temp = new Date(date);
        for (var i = 0; i < 12; i++) {
          var temp = new Date(date);
          temp.setMonth(temp.getMonth() + i);
          this.previewHeader.push({ sDate: temp, eDate: '' });
        }
        break;
      case 4:
        var date = new Date(this.minDate);
        for (var i = 0; i < 4; i++) {
          var temp = new Date(date);
          date.setMonth(date.getMonth() + (i == 0 ? 2 : 3));
          temp.setMonth(temp.getMonth() + (i == 0 ? 0 : 1));
          this.previewHeader.push({ sDate: temp, eDate: new Date(date) });
        }
        break;
      case 2:
        var date = new Date(this.minDate);
        for (var i = 0; i < 2; i++) {
          var temp = new Date(date);
          date.setMonth(date.getMonth() + (i == 0 ? 5 : 6));
          temp.setMonth(temp.getMonth() + (i == 0 ? 0 : 1));
          this.previewHeader.push({ sDate: temp, eDate: new Date(date) });
        }
        break;
      case 1:
        var date = new Date(this.minDate);
        var temp = new Date(date);
        date.setMonth(date.getMonth() + 11);
        this.previewHeader.push({ sDate: temp, eDate: new Date(date) });
        break;
    }
  }
  showDialog(_feeplan: FeePlan) {
    this.onPreview(_feeplan);
    this.calculateDateForPreview();
    this.totals = [];
    this.feeHeadAmounts = [];
    var frequency = this.frequency;
    var feeManagement = this.feePlanManagement;
    var tablePreview = this.feeHeadAmounts;
    var total = Array.apply(null, Array(frequency.length)).map(Number.prototype.valueOf, 0);
    var allTotal = 0;
    feeManagement.forEach((fee, j) => {
      var tempPreview = {};
      var charges = [];
      tempPreview = { name: fee.name, frequencyName: fee.frequencyName, charges: [], totalAmount: 0 };
      frequency.forEach((item, i) => {
        var filterDate = _.filter(this.feePlanPreviewDetails, function (j) {
          if (j.feeHeadId == fee.feeHeadId && typeof j.dueDate == 'object') {

            return j.dueDate.toISOString().split('T')[0] == item['date'].toISOString().split('T')[0];

          } else if (j.feeHeadId == fee.feeHeadId && typeof j.dueDate != 'object') {
            return j.dueDate.split('T')[0] == item['date'].toISOString().split('T')[0];
          }
        });
        if (filterDate.length) {

          total[i] += filterDate[0].feeCharges;
          tempPreview['totalAmount'] += filterDate[0].feeCharges;
          charges.push(filterDate[0].feeCharges);
          allTotal += filterDate[0].feeCharges;
        } else {
          total[i] += 0;
          charges.push('-');
        }

      });
      this.totals = total;
      tempPreview['charges'] = charges;
      tablePreview.push(tempPreview);
    });
    this.totals.splice(0, 0, allTotal);
    setTimeout(() => {
      this.previewVisible = !this.previewVisible;
    }, 10);
  }
  onAlert() {
    this.confirmationService.confirm({
      message: 'Record Is Verified and Unavailable For Update.',
      header: 'Verified',
      icon: 'fa fa-info',
      reject: () => {
      }
    });
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
    this.route.queryParams.forEach((params: Params) => {
      this.from = params['from'];
    });
    this.route.params.forEach((params: Params) => {
      this.params = params['feeId'];
      if (this.params) {
        this.feesService.getFeePlanById(this.params)
          .subscribe((results: any) => {
            let index = 0;
            this.planeName = results.feePlanName;
            this.feePlanDetails = _.sortBy(results.FeePlanDetails, ['feeHeadId', 'sequenceNumber']); results.FeePlanDetails;
            this.planeDesc = results.feePlanDescription;
            this.feePlanManagement = [];
            let uniqFeeHead = _.uniqBy(results.FeePlanDetails, 'feeHeadId');
            this.isTransactionProcessed = results.isTransactionProcessed;
            this.createdBy = results.createdByUserDetails ? results.createdByUserDetails.username : null;
            this.updatedBy = results.updatedByUserDetails ? results.updatedByUserDetails.username : null;
            this.verifiedBy = results.verifiedByUserDetails ? results.verifiedByUserDetails.username : null;
            this.isVerified = results.isVerified;
            if (this.isVerified) {
              this.onAlert();
            }
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
          this.staticFeeHeadList.push({ label: response[key].feeHeadName, value: response[key].id, frequencyValue: response[key].FeeheadsFrequency.frequencyValue, frequencyName: response[key].FeeheadsFrequency.frequencyName });
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
    let tempFeeHead = _.find(this.staticFeeHeadList, { 'value': record.feeHeadId });
    this.feePlanManagement[index].name = tempFeeHead.label;
    record.frequencyName = tempFeeHead.frequencyName;
    this.checkMaxSequenceNumber(index);
  }

  onPreview(_feeplan: FeePlan) {
    this.feePlanPreviewDetails = [];
    let _staticFeeHeadList = this.staticFeeHeadList;
    let _selectedAcademicYear = this.selectedAcademicYear;
    let _frequency = this.frequency;
    let _maxLength = this.frequency.length;
    let _feePlanDetails = this.feePlanPreviewDetails;
    let _vm = this;
    _.forEach(this.feePlanManagement, function (value) {
      
      let tempFeeHead = _.find(_staticFeeHeadList, { 'value': value.feeHeadId });
      let splitAmount = 0;
      for (let index = 0; index < tempFeeHead.frequencyValue; index++) {
        
       
        if (value.frequencyName == "Quarterly" && value.skipQuarter && index+1 <= value.skipQuarter) {
          splitAmount = Math.floor((value.amount / (4 - value.skipQuarter) * value.skipQuarter));
        } else {
          let feePlanDetailObj = new FeePlanDetails();
          feePlanDetailObj.feePlanId = _feeplan.id;
          
          feePlanDetailObj.feeHeadId = value.feeHeadId;
          feePlanDetailObj.schoolId = parseInt(localStorage.getItem('schoolId'));
          feePlanDetailObj.academicYear = _selectedAcademicYear;
          feePlanDetailObj.feeCharges = index ==3 ? 4*value.amount-(3-value.skipQuarter)*(splitAmount+value.amount):value.amount+splitAmount;
          //feePlanDetailObj.feeCharges = value.amount;
          if (tempFeeHead.frequencyValue == 1) {
            feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
            feePlanDetailObj.sequenceNumber = 1;
          }
          else if (tempFeeHead.frequencyValue == 2) {
            if (index == 1 && _maxLength == 12) {
              feePlanDetailObj.dueDate = new Date(_frequency[6].date.toString());
              feePlanDetailObj.sequenceNumber = 7;
            }
            else if (index == 1 && _maxLength == 4) {
              feePlanDetailObj.dueDate = new Date(_frequency[2].date.toString());
              feePlanDetailObj.sequenceNumber = 7;
            }
            else if (index == 1 && _maxLength == 2) {
              feePlanDetailObj.dueDate = new Date(_frequency[1].date.toString());
              feePlanDetailObj.sequenceNumber = 7;
            }
            else {
              feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
              feePlanDetailObj.sequenceNumber = 1;
            }
          }
          else if (tempFeeHead.frequencyValue == 4) {
            if (_maxLength == 4 || index == 0) {
              feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
              feePlanDetailObj.sequenceNumber = index + 1;
            }
            else if (index == 1 && _maxLength == 12) {
              feePlanDetailObj.dueDate = new Date(_frequency[3].date.toString());
              feePlanDetailObj.sequenceNumber = 4;
            }
            else if (index == 2 && _maxLength == 12) {
              feePlanDetailObj.dueDate = new Date(_frequency[6].date.toString());
              feePlanDetailObj.sequenceNumber = 7;
            } else if (index == 3 && _maxLength == 12) {
              feePlanDetailObj.dueDate = new Date(_frequency[9].date.toString());
              feePlanDetailObj.sequenceNumber = 10;
            }
          }
          else if (tempFeeHead.frequencyValue == 12) {
            feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
            feePlanDetailObj.sequenceNumber = index + 1;
          }
          _feePlanDetails.push(feePlanDetailObj);
        }

      }
    });
  }
  checkMaxSequenceNumber(index) {
    let vm = this;
    vm.sequenceNumberArr = [];
    _.forEach(this.feePlanManagement, function (record) {
      let tempFeeHead = _.find(vm.staticFeeHeadList, { 'value': record.feeHeadId });
      if (tempFeeHead) {
        vm.sequenceNumberArr[index] = tempFeeHead.frequencyValue;
        index++;
      }
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

  setDateHour(datecval) {
    return new Date(new Date(datecval).setHours(22));
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
    if (tempYear) {
      this.minDate = this.setDateHour(new Date(new Date(tempYear.startDate).setDate(this.paymentProcessDate)));
      this.maxDate = this.setDateHour(new Date(tempYear.endDate));
      this.academicYearRange = this.maxDate.getFullYear() + ':' + (this.maxDate.getFullYear());
    }
  }

  removeFeeHeadDetails(item, rowNum) {
    let deletedFeeHeadItem = _.find(this.staticFeeHeadList, { 'value': item.feeHeadId });
    this.feePlanManagement.splice(rowNum, 1);
    if (deletedFeeHeadItem) {
      this.feePlanManagement.forEach(element => {
        element.feeHeadList.push(deletedFeeHeadItem);
      });
      this.checkMaxSequenceNumber(rowNum);
    }
  }

  addFeeHeadDetails(feeItem) {
    feeItem = _.cloneDeep(feeItem);
    if (!this.validateFeeHead(feeItem)) {
      return false;
    }
    let vm = this;
    let newHeadList = _.filter(vm.staticFeeHeadList, function (item) {
      return _.findIndex(vm.feePlanManagement, { 'feeHeadId': item.value }) === -1;
    });
    let feeObj = {
      contRoleId: Math.floor(Math.random() * 2000),
      feeHeadList: newHeadList,
      feeHeadId: 0,
      amount: 0,
      confirmAmount: 0,
      name: '',
      skipQuarter: 0,
    };

    this.feePlanManagement.push(_.cloneDeep(feeObj))
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
    if (feeItem.amount && parseInt(feeItem.amount) < 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Enter Valid Amount' });
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
    let amount= 0 ;
    let newHeadList = _.filter(_staticFeeHeadList, function (item) {
      return _.findIndex(_feePlanManagement, { 'feeHeadId': item.value }) === -1;
    });
    let temp = _.cloneDeep(feeItem)
    let tempFeeHead = _.find(this.staticFeeHeadList, { 'value': temp.feeHeadId });
    _.forEach(this.feePlanManagement, function (feeplanObj) {
      feeplanObj.feeHeadList = _.remove(feeplanObj.feeHeadList, function (feeheadObj) {
        return feeheadObj.value != temp.feeHeadId;
      });
    });
    amount= temp.feeCharges ;
    let name = _.find(this.feeHeadList, { value: temp.feeHeadId });
    if (tempFeeHead.frequencyName == "Quarterly" && temp.numberOfQuarterSkipped!=0) {
      
      let temp = 0;
      this.feePlanDetails.map((item)=>{
        if(item.feeHeadId==feeItem.feeHeadId) {
          temp += item.feeCharges;
        }
      })
      
      amount = temp/4;      
    } 
    this.feePlanManagement.push({
      contRoleId: Math.floor(Math.random() * 2000),
      feeHeadList: newHeadList,
      feeHeadId: temp.feeHeadId,
      amount,
      name: name.label,
      frequencyName: tempFeeHead.frequencyName,
      confirmAmount: amount,
      skipQuarter: temp.numberOfQuarterSkipped
    })
  }


  getAcademicYear() {
    let academicYears = this.academicYearService.getAllAcademicYears();
    academicYears.subscribe((response) => {
      this.getAllFees();
      // this.academicYearList.push({ label: '--Select--', value: 'select' });
      // this.academicYearList = response;

      for (let key in response) {
        if (response.hasOwnProperty(key)) {
          this.academicYearList.push({ label: response[key].academicYear, value: response[key].academicYear, startDate: response[key].startDate, endDate: response[key].endDate, isCurrent: response[key].isCurrent });
        }
      }


      let item = _.find(this.academicYearList, { isCurrent: true });
      if (item) {
        this.selectedAcademicYear = item.academicYear;
      }
      this.onAcademicYearChange();
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
      _feeplan.isVerified = this.from == 'verify' ? this.canVerify ? true : false : false;
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
    this.from == 'verify' ?
      this.router.navigate(['/features/fees/feesPlan/verifyList']) :
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
      let splitAmount = 0;
      let isQuarterSkipped = false;
      let numberOfQuarterSkipped =0;
      for (let index = 0; index < tempFeeHead.frequencyValue; index++) {
        if (value.frequencyName == "Quarterly" && value.skipQuarter && index+1 <= value.skipQuarter) {
          splitAmount = Math.floor((value.amount / (4 - value.skipQuarter) * value.skipQuarter));
          isQuarterSkipped = true;
          numberOfQuarterSkipped = value.skipQuarter;
        } else {
        let feePlanDetailObj = new FeePlanDetails();
        feePlanDetailObj.feePlanId = _feeplan.id;
        feePlanDetailObj.isQuarterSkipped = isQuarterSkipped;
        feePlanDetailObj.numberOfQuarterSkipped = numberOfQuarterSkipped;
        feePlanDetailObj.feeHeadId = value.feeHeadId;
        feePlanDetailObj.schoolId = parseInt(localStorage.getItem('schoolId'));
        feePlanDetailObj.academicYear = _selectedAcademicYear;
        feePlanDetailObj.feeCharges = index ==3 ? 4*value.amount-(3-value.skipQuarter)*(splitAmount+value.amount):value.amount+splitAmount;
        if (tempFeeHead.frequencyValue == 1) {
          feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
          feePlanDetailObj.sequenceNumber = 1;
        }
        else if (tempFeeHead.frequencyValue == 2) {
          if (index == 1 && _maxLength == 12) {
            feePlanDetailObj.dueDate = new Date(_frequency[6].date.toString());
            feePlanDetailObj.sequenceNumber = 7;
          }
          else if (index == 1 && _maxLength == 4) {
            feePlanDetailObj.dueDate = new Date(_frequency[2].date.toString());
            feePlanDetailObj.sequenceNumber = 7;
          }
          else if (index == 1 && _maxLength == 2) {
            feePlanDetailObj.dueDate = new Date(_frequency[1].date.toString());
            feePlanDetailObj.sequenceNumber = 7;
          }
          else {
            feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
            feePlanDetailObj.sequenceNumber = 1;
          }
        }
        else if (tempFeeHead.frequencyValue == 4) {
          if (_maxLength == 4 || index == 0) {
            feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
            feePlanDetailObj.sequenceNumber = index + 1;
          }
          else if (index == 1 && _maxLength == 12) {
            feePlanDetailObj.dueDate = new Date(_frequency[3].date.toString());
            feePlanDetailObj.sequenceNumber = 4;
          }
          else if (index == 2 && _maxLength == 12) {
            feePlanDetailObj.dueDate = new Date(_frequency[6].date.toString());
            feePlanDetailObj.sequenceNumber = 7;
          } else if (index == 3 && _maxLength == 12) {
            feePlanDetailObj.dueDate = new Date(_frequency[9].date.toString());
            feePlanDetailObj.sequenceNumber = 10;
          }
        }
        else if (tempFeeHead.frequencyValue == 12) {
          feePlanDetailObj.dueDate = new Date(_frequency[index].date.toString());
          feePlanDetailObj.sequenceNumber = index + 1;
        }
        _feePlanDetails.push(feePlanDetailObj);
      }
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
          this.from == 'verify' ? this.router.navigate(['/features/fees/feesPlan/verifyList']) : this.router.navigate(['/features/fees/feesPlan/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });

  }

}
