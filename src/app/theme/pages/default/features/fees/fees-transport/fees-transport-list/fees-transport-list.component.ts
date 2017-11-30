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
    frequencyList: any = [];
    academicYearList: any = [];
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
    confirmZoneCostErr: boolean = false;
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
        this.transportServics.getAllTransports(url)
            .subscribe(response => {
                this.transportList = response;
                if (this.transportList.length > 0) {
                    if (this.academicYear === this.transportList[0].academicyear) {
                        this.frequencyId = this.transportList[0].frequencyId;
                        this.disableFrequecy = true;
                    }
                    else {
                        this.frequencyId = null;
                        this.disableFrequecy = false;
                    }
                }
                if (this.transportList.length == 0) {
                    this.frequencyId = null;
                    this.disableFrequecy = false;
                    this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '', 'confirmZoneCost': null });
                }
            });
    }
    validateRow() {
        if (this.transportList[this.transportList.length - 1].zoneCode !== undefined
            && this.transportList[this.transportList.length - 1].zoneCode !== '') {
            document.getElementById('zonecode' + (this.transportList.length - 1)).style.display = 'none';
            if (this.transportList[this.transportList.length - 1].zoneCost !== undefined
                && this.transportList[this.transportList.length - 1].zoneCost !== null) {
                document.getElementById('zonecost' + (this.transportList.length - 1)).style.display = 'none';
                return true;
            } else {
                document.getElementById('zonecost' + (this.transportList.length - 1)).style.display = 'block';
            }
        } else {
            document.getElementById('zonecost' + (this.transportList.length - 1)).style.display = 'none';
            document.getElementById('zonecode' + (this.transportList.length - 1)).style.display = 'block';
        }

    }
    addRow() {
        if (this.validateRow()) {
            if (!this.confirmZoneCostErr) {
                this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '', 'confirmZoneCost': null });
            }
        }
        // document.getElementById('zonecode'+(this.transportList.length-1)).removeAttribute('disabled');
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
    enableEdit(row) {
        row.enable = true;
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
    onSaveTransport() {
        if (this.frequencyId === null) {
            this.isFrequencySelected = true;
            this.isAcademicYearSelected = false;
        } else if (this.transportList[this.transportList.length - 1].zoneCode === ''
            || this.transportList[this.transportList.length - 1].zoneCost === null
            || this.transportList[this.transportList.length - 1].confirmZoneCost === null) {
            this.rowErr = true;
            this.isFrequencySelected = false;
            this.isAcademicYearSelected = false;
        }
        else if (!this.confirmZoneCostErr) {
            this.rowErr = false;
            this.isFrequencySelected = false;
            this.isAcademicYearSelected = false;
            this.transportList.forEach(element => {
                element.frequencyId = this.frequencyId;
                element.academicyear = this.academicYear;
                element.schoolId = localStorage.getItem('schoolId');
            });

            this.checkMaxSequenceNumber();

            let _tempUpdateList: any = [];
            let _tempNewList: any = [];
            this.transportList.forEach(element => {
                if (element.id === null) {
                    _tempNewList.push(element);
                }
                else {
                    _tempUpdateList.push(element);
                }
            });
            if (_tempNewList.length > 0) {
                this.transportServics.createTransport(_tempNewList).subscribe(
                    data => {
                        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                        let details = [];
                        data.forEach(element => {
                            this.frequency.forEach(freq => {
                                let _tempDetails: any = {};
                                _tempDetails.schoolId = localStorage.getItem('schoolId');
                                _tempDetails.zoneId = element.id;
                                _tempDetails.academicYear = this.academicYear;
                                _tempDetails.dueDate = freq.date;
                                _tempDetails.sequenceNumber = freq.sequenceNumber;
                                details.push(_tempDetails);
                            });
                        });
                        this.saveZoneDetails(details);
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    });
            }
            if (_tempUpdateList.length > 0) {
                _tempUpdateList.forEach(element => {
                    this.transportServics.updateTransport(element).subscribe(
                        data => {
                            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });

                        }, error => {
                            this.globalErrorHandler.handleError(error);
                        });
                });
            }
        } else {
            this.rowErr = false;
            this.isFrequencySelected = false;
        }
    }
    onSaveTransportRows(row: any) {
        if (row.zoneCode !== '' && row.zoneCost !== null && row.confirmZoneCost !== undefined && row.confirmZoneCost !== null && !this.confirmZoneCostErr) {
            this.rowErr = false;
            if (row.id === null) {
                row.frequencyId = this.frequencyId;
                row.academicyear = this.academicYear;
                row.schoolId = localStorage.getItem('schoolId');
                this.checkMaxSequenceNumber();
                this.transportServics.createTransport([row]).subscribe(
                    data => {
                        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                        let details = [];
                        data.forEach(element => {
                            this.frequency.forEach(freq => {
                                let _tempDetails: any = {};
                                _tempDetails.schoolId = localStorage.getItem('schoolId');
                                _tempDetails.zoneId = element.id;
                                _tempDetails.academicYear = this.academicYear;
                                _tempDetails.dueDate = freq.date;
                                _tempDetails.sequenceNumber = freq.sequenceNumber;
                                details.push(_tempDetails);
                            });
                        });
                        this.saveZoneDetails(details);
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    });
            } else {
                this.transportServics.updateTransport(row).subscribe(
                    data => {
                        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });

                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    });
            }
        } else {
            this.rowErr = true;
        }

    }
}
