import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';
import * as _ from 'lodash/index';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { School } from "../../../../_models/school";
import { Transport } from "../../../../_models/index";
import { ViewChild } from '@angular/core';
import { Helpers } from "../../../../../../../helpers";
import { TransportService, FrequencyService, AcademicYearService } from '../../../../../default/_services/index';
import { ConfirmationService } from 'primeng/primeng';
import { SchoolService } from '../../../../_services/index';

@Component({
    selector: "app-transport-list",
    templateUrl: "./fees-transport-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TransportListComponent implements OnInit {
    schoolList: SelectItem[];
    listDisable: boolean;
    schoolId: string;
    frequencyId: number = null;
    academicYear: string;
    transportList: any = [];
    tempTransportList: any = [];
    frequencyList: any = [];
    academicYearList: any = [];
    details: any = [];
    frequency = [{
        sequenceNumber: 1,
        date: new Date()
    }];
    minDate: Date;
    maxDate: Date;
    isFrequencySelected: boolean = false;
    isAcademicYearSelected: boolean = false;
    isSubmitted: boolean = false;
    rowErr: boolean = false;
    disableFrequecy: boolean = false;
    disabledZoneCode: boolean = false;
    confirmZoneCostErr: boolean = false;
    isRequired: boolean = false;
    paymentProcessDate: number;
    constructor(
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService,
        private transportServics: TransportService,
        private frequencyService: FrequencyService,
        private academicYearService: AcademicYearService,
        private confirmationService: ConfirmationService,
        private schoolService: SchoolService,
    ) {
    }

    ngOnInit() {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.transportList = [];
        // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
        } else {
            this.schoolId = localStorage.getItem("schoolId");
            this.getSchoolDetails();
        }


    }
    getSchoolDetails() {
        let schoolId = parseInt(localStorage.getItem('schoolId'));
        this.schoolService.getSchoolById(schoolId).subscribe((response) => {
            this.paymentProcessDate = parseInt(response.processingDate);
            Observable.forkJoin([this.frequencyService.getAllFrequency(), this.academicYearService.getAllAcademicYears()])
                .subscribe((response) => {
                    this.frequencyList = response[0] ? response[0] : [];
                    this.academicYearList = response[1] ? response[1] : [];
                    let url = '';
                    if (this.academicYearList.length > 0) {
                        let item = _.find(this.academicYearList, { isCurrent: true });
                        if (item) {
                            this.academicYear = item.academicYear;
                            this.minDate = new Date(new Date(item.startDate).setDate(this.paymentProcessDate));
                            this.maxDate = new Date(item.endDate);
                            // url = '?&filter[where][academicyear]=' + this.academicYear;
                            this.getAllTransports(url);
                        }
                        else {
                            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Current year is not available' });
                            // this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '', 'confirmZoneCost': null });
                        }
                    }
                    else {
                        this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Academic year is not available' });
                    }

                })
        },
            error => {
                this.globalErrorHandler.handleError(error);
            }
        );
    }
    getAllTransports(url) {
        Helpers.setLoading(true);
        this.transportServics.getAllTransports(url)
            .subscribe(response => {
                Helpers.setLoading(false);
                this.transportList = response;
                this.tempTransportList = _.cloneDeep(response);
                if (this.transportList.length > 0) {
                    if (this.academicYear === this.transportList[0].academicyear) {
                        this.frequencyId = this.transportList[0].frequencyId;
                        this.disableFrequecy = true;
                        this.disabledZoneCode = true;
                    }
                    else {
                        this.frequencyId = null;
                        this.disableFrequecy = false;
                        this.disabledZoneCode = false;
                    }
                }
                this.transportList.forEach(element => {
                    element.confirmZoneCost = element.zoneCost;
                    element.disableFrequecy = this.disableFrequecy;
                    element.disabledZoneCode = this.disabledZoneCode;
                });

                if (this.transportList.length == 0) {
                    this.frequencyId = null;
                    this.disableFrequecy = false;
                    this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '', 'confirmZoneCost': null });
                }
            });
    }
    addRow(row: any, rowNum: any) {
        if (row.zoneCode !== '' && row.zoneCost !== null && row.confirmZoneCost !== undefined && row.confirmZoneCost !== null) {
            if (row.zoneCost === row.confirmZoneCost) {
                this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '', 'confirmZoneCost': null });
            } else {
                this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Amount and Confirm Amount do not match at Row Number: ' + (rowNum + 1) });
            }
        }
        else {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please fill the require fields at Row Number: ' + (rowNum + 1) });
        }
    }
    addRowAndSave(row: any, rowNum: any) {
        if (!row.disableFrequecy) {
            this.onSaveTransportRows(row, rowNum);
        }
        if (row.zoneCode !== '' && row.zoneCost !== null && row.confirmZoneCost !== undefined && row.confirmZoneCost !== null && (row.zoneCost === row.confirmZoneCost)) {
            this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '', 'confirmZoneCost': null });
            //row.disabledZoneCode = false;
        }
    }
    onDeleteTransport(data: any, index: any) {
        if (data.id) {
            this.confirmationService.confirm({
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.transportServics.deleteTransport(data.id).subscribe(
                        data => {
                            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
                            let url = '';
                            this.getAllTransports(url);
                        }, error => {
                            this.globalErrorHandler.handleError(error);
                        });
                },
                reject: () => {
                }
            });
        }
        else {
            this.transportList.splice(index, 1);
            this.rowErr = false;

        }
    }
    enableEdit(i, row) {
        // document.getElementById('txtZoneDesc' + i).removeAttribute('disabled');
        // document.getElementById('txtZoneCost' + i).removeAttribute('disabled');
        // document.getElementById('txtZoneConfirmCost' + i).removeAttribute('disabled');
        row.disableFrequecy = false;
    }
    onAcademicYear(val: any) {
        this.disableFrequecy = false;
        let url = '';
        // let url = '?&filter[where][academicyear]=' + val;
        this.getAllTransports(url);
    }
    onConfirmCost(row: Transport, index: any) {
        if (row.zoneCost !== row.confirmZoneCost) {
            this.confirmZoneCostErr = true;
            document.getElementById('confirmzonecost' + index).style.display = 'block';
        } else {
            document.getElementById('confirmzonecost' + index).style.display = 'none';
            this.confirmZoneCostErr = false;
        }
    }

    checkMaxSequenceNumber() {
        let vm = this;
        vm.frequency = [];
        let _tempFrequency = _.find(vm.frequencyList, { 'id': this.frequencyId });
        for (let index = 0; index < _tempFrequency.frequencyValue; index++) {
            let newObj = {
                sequenceNumber: index,
                date: new Date()
            }
            vm.calculateDate(_tempFrequency.frequencyValue, index, newObj);
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
    saveZoneDetails(details: any) {
        this.transportServics.addZoneDetails(details).subscribe(
            data => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                let url = '';
                this.getAllTransports(url);
            }, error => {
                this.globalErrorHandler.handleError(error);
            });
    }
    saveZoneDetailsWithAddRow(details: any) {
        this.transportServics.addZoneDetails(details).subscribe(
            data => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
            }, error => {
                this.globalErrorHandler.handleError(error);
            });
    }
    onSaveTransport() {
        this.isRequired = false;
        this.confirmZoneCostErr = false;
        if (this.frequencyId === null) {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please select Payment Frequency ' });
            this.isAcademicYearSelected = false;
        } else {
            for (let i = 0; i < this.transportList.length; i++) {
                if (this.transportList[i].zoneCode === '' || this.transportList[i].zoneCost === null || this.transportList[i].confirmZoneCost === null) {
                    this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please fill the require fields at Row Number: ' + (i + 1) });
                    this.isRequired = true;
                    break;
                }
                if (this.transportList[i].zoneCost !== this.transportList[i].confirmZoneCost) {
                    this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Amount and Confirm Amount do not match at Row Number: ' + (i + 1) });
                    this.confirmZoneCostErr = true;
                    break;
                }
            }
            if (!this.isRequired && !this.confirmZoneCostErr) {
                this.checkMaxSequenceNumber();
                let _tempUpdateList: any = [];
                let _tempNewList: any = [];
                this.transportList.forEach(element => {
                    element.frequencyId = this.frequencyId;
                    element.academicyear = this.academicYear;
                    element.schoolId = localStorage.getItem('schoolId');
                    if (element.id === null) {
                        _tempNewList.push(element);
                    }
                    else {
                        _tempUpdateList.push(element);
                    }
                });
                if (_tempNewList.length > 0) {
                    Observable.forkJoin([this.transportServics.createTransport(_tempNewList), this.transportServics.updateTransportZone(this.schoolId, { "academicYear": this.academicYear })])
                        .subscribe((response) => {
                            let data: any = response[0];
                            let details = [];
                            let maxFreq = _.find(this.frequencyList, { 'id': this.frequencyId });
                            data.forEach(element => {
                                this.frequency.forEach(freq => {
                                    let _tempDetails: any = {};
                                    _tempDetails.schoolId = localStorage.getItem('schoolId');
                                    _tempDetails.zoneId = element.id;
                                    _tempDetails.academicYear = this.academicYear;
                                    _tempDetails.dueDate = freq.date;
                                    //frequencyId

                                    if (maxFreq.frequencyValue == 1) {
                                        _tempDetails.sequenceNumber = 1;
                                    }
                                    else if (maxFreq.frequencyValue == 2) {
                                        if (freq.sequenceNumber == 1) {
                                            _tempDetails.sequenceNumber = 7;
                                        }
                                        else {
                                            _tempDetails.sequenceNumber = 1;
                                        }
                                    }
                                    else if (maxFreq.frequencyValue == 4) {
                                        if (freq.sequenceNumber == 0) {
                                            _tempDetails.sequenceNumber = 1;
                                        }
                                        else if (freq.sequenceNumber == 1) {
                                            _tempDetails.sequenceNumber = 4;
                                        }
                                        else if (freq.sequenceNumber == 2) {
                                            _tempDetails.sequenceNumber = 7;
                                        } else if (freq.sequenceNumber == 3) {
                                            _tempDetails.sequenceNumber = 10;
                                        }
                                    }
                                    else if (maxFreq.frequencyValue == 12) {
                                        _tempDetails.sequenceNumber = freq.sequenceNumber + 1;
                                    }


                                    // _tempDetails.sequenceNumber = freq.sequenceNumber;
                                    details.push(_tempDetails);
                                });
                            });
                            this.saveZoneDetails(details);
                        });
                }
                if (_tempUpdateList.length > 0) {
                    Observable.forkJoin([_tempUpdateList.forEach(element => {
                        this.tempTransportList.forEach(element1 => {
                            if ((element.id === element1.id)
                                && (element.zoneCode !== element1.zoneCode || element.zoneDescription !== element1.zoneDescription || element.zoneCost !== element1.zoneCost)) {
                                this.transportServics.updateTransport(element).subscribe(
                                    data => {
                                        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                                        this.details = [];
                                        let maxFreq = _.find(this.frequencyList, { 'id': this.frequencyId });
                                        let count = 0;
                                        this.frequency.forEach(freq => {
                                            count++;
                                            let _tempDetails: any = {};
                                            _tempDetails.schoolId = localStorage.getItem('schoolId');
                                            _tempDetails.zoneId = data.id;
                                            _tempDetails.academicYear = this.academicYear;
                                            _tempDetails.dueDate = freq.date;
                                            //frequencyId

                                            if (maxFreq.frequencyValue == 1) {
                                                _tempDetails.sequenceNumber = 1;
                                            }
                                            else if (maxFreq.frequencyValue == 2) {
                                                if (freq.sequenceNumber == 1) {
                                                    _tempDetails.sequenceNumber = 7;
                                                }
                                                else {
                                                    _tempDetails.sequenceNumber = 1;
                                                }
                                            }
                                            else if (maxFreq.frequencyValue == 4) {
                                                if (freq.sequenceNumber == 0) {
                                                    _tempDetails.sequenceNumber = 1;
                                                }
                                                else if (freq.sequenceNumber == 1) {
                                                    _tempDetails.sequenceNumber = 4;
                                                }
                                                else if (freq.sequenceNumber == 2) {
                                                    _tempDetails.sequenceNumber = 7;
                                                } else if (freq.sequenceNumber == 3) {
                                                    _tempDetails.sequenceNumber = 10;
                                                }
                                            }
                                            else if (maxFreq.frequencyValue == 12) {
                                                _tempDetails.sequenceNumber = freq.sequenceNumber + 1;
                                            }


                                            // _tempDetails.sequenceNumber = freq.sequenceNumber;
                                            this.details.push(_tempDetails);
                                        });
                                        if (_tempUpdateList.length === count) {
                                            this.saveZoneDetails(this.details);
                                        }
                                    }, error => {
                                        this.globalErrorHandler.handleError(error);
                                    });
                            }
                        });
                    }), this.transportServics.updateTransportZone(this.schoolId, { "academicYear": this.academicYear })])
                        .subscribe((response) => {
                            //
                        },
                        error => { //console.log(error) 
                        });

                }
            }
        }
    }
    onSaveTransportRows(row: any, rowNum: any) {
        if (row.zoneCode !== '' && row.zoneCost !== null && row.confirmZoneCost !== undefined && row.confirmZoneCost !== null) {
            if (row.zoneCost === row.confirmZoneCost) {
                if (row.id === null) {
                    row.frequencyId = this.frequencyId;
                    row.academicyear = this.academicYear;
                    row.schoolId = localStorage.getItem('schoolId');
                    this.checkMaxSequenceNumber();
                    this.transportServics.createTransport([row]).subscribe(
                        data => {
                            let details = [];
                            let tempFeeHead = _.find(this.frequencyList, { 'id': this.frequencyId });
                            data.forEach(element => {
                                this.frequency.forEach(freq => {
                                    let _tempDetails: any = {};
                                    _tempDetails.schoolId = localStorage.getItem('schoolId');
                                    _tempDetails.zoneId = element.id;
                                    _tempDetails.academicYear = this.academicYear;
                                    _tempDetails.dueDate = freq.date;
                                    if (tempFeeHead.frequencyValue == 1) {
                                        _tempDetails.sequenceNumber = 1;
                                    }
                                    else if (tempFeeHead.frequencyValue == 2) {
                                        if (freq.sequenceNumber == 1) {
                                            _tempDetails.sequenceNumber = 7;
                                        }
                                        else {
                                            _tempDetails.sequenceNumber = 1;
                                        }
                                    }
                                    else if (tempFeeHead.frequencyValue == 4) {
                                        if (freq.sequenceNumber == 0) {
                                            _tempDetails.sequenceNumber = 1;
                                        }
                                        else if (freq.sequenceNumber == 1) {
                                            _tempDetails.sequenceNumber = 4;
                                        }
                                        else if (freq.sequenceNumber == 2) {
                                            _tempDetails.sequenceNumber = 7;
                                        } else if (freq.sequenceNumber == 3) {
                                            _tempDetails.sequenceNumber = 10;
                                        }
                                    }
                                    else if (tempFeeHead.frequencyValue == 12) {
                                        _tempDetails.sequenceNumber = freq.sequenceNumber + 1;
                                    }
                                    details.push(_tempDetails);
                                });
                            });
                            this.saveZoneDetailsWithAddRow(details);
                            row.disableFrequecy = true;
                            row.disabledZoneCode = true;
                        }, error => {
                            this.globalErrorHandler.handleError(error);
                        });
                } else {
                    this.transportServics.updateTransport(row).subscribe(
                        data => {
                            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                            row.disableFrequecy = true;
                        }, error => {
                            this.globalErrorHandler.handleError(error);
                        });
                }
            } else {
                this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Amount and Confirm Amount do not match at Row Number: ' + (rowNum + 1) });
            }
        } else {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please fill the require fields at Row Number: ' + (rowNum + 1) });
        }

    }
}
