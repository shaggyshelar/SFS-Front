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
    academicYear: string = 'null';
    transportList: Transport[];
    frequencyList: any = [];
    academicYearList: any = [];
    isFrequencySelected: boolean = false;
    isAcademicYearSelected: boolean = false;
    isSubmitted: boolean = false;
    rowErr: boolean = false;
    disableFrequecy: boolean = false;
    constructor(
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService,
        private transportServics: TransportService,
        private frequencyService: FrequencyService,
        private academicYearService: AcademicYearService,
        private confirmationService: ConfirmationService,
    ) {
    }

    ngOnInit() {
        this.transportList = [];
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
            this.listDisable = false;
        } else {
            this.schoolId = localStorage.getItem("schoolId");
            this.listDisable = true;

            Observable.forkJoin([this.frequencyService.getAllFrequency(), this.academicYearService.getAllAcademicYears()])
                .subscribe((response) => {
                    this.frequencyList = response[0] ? response[0] : [];
                    this.academicYearList = response[1] ? response[1] : [];
                    let url = '';
                    if (this.academicYearList.length > 0) {
                        let item = _.find(this.academicYearList, { isCurrent: true });
                        if (item) {
                            this.academicYear = item.academicYear;
                            url = '?&filter[where][academicyear]=' + this.academicYear;
                            this.getAllTransports(url);
                        }
                        else {
                            this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '' });
                        }
                    }
                    else {
                        this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '' });
                    }

                })
        }


    }

    getAllTransports(url) {
        this.transportServics.getAllTransports(url)
            .subscribe(response => {
                this.transportList = response;
                if (this.transportList.length > 0) {
                    this.frequencyId = this.transportList[0].frequencyId;
                    this.disableFrequecy = true;
                }
                if (this.transportList.length == 0) {
                    this.frequencyId = null;
                    this.disableFrequecy = false;
                    this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '' });
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
            this.transportList.push({ 'id': null, 'schoolId': null, 'frequencyId': null, 'zoneCode': '', 'zoneDescription': '', 'zoneCost': null, 'academicyear': '' });
        }
    }
    onDeleteTransport(id: any) {
        this.transportList.splice(id, 1);
    }
    enableEdit(row) {
        row.enable = true;
    }
    onAcademicYear(val: any) {
        this.disableFrequecy = false;
        let url = '?&filter[where][academicyear]=' + val;
        this.getAllTransports(url);
    }

    onSaveTransport() {
        if (this.academicYear === "null" && this.frequencyId === null) {
            this.isFrequencySelected = true;
            this.isAcademicYearSelected = true;
        } else if (this.frequencyId === null) {
            this.isFrequencySelected = true;
            this.isAcademicYearSelected = false;
        } else if (this.academicYear === "null") {
            this.isFrequencySelected = false;
            this.isAcademicYearSelected = true;
        } else if (this.transportList[this.transportList.length - 1].zoneCode === ''
            || this.transportList[this.transportList.length - 1].zoneCost === null) {
            this.rowErr = true;
            this.isFrequencySelected = false;
            this.isAcademicYearSelected = false;
        }
        else {
            this.rowErr = false;
            this.isFrequencySelected = false;
            this.isAcademicYearSelected = false;
            this.transportList.forEach(element => {
                element.frequencyId = this.frequencyId;
                element.academicyear = this.academicYear;
            });
            this.transportServics.createTransport(this.transportList).subscribe(
                data => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Addes Successfully' });
                    let url = '?&filter[where][academicyear]=' + this.academicYear;
                    this.getAllTransports(url);

                }, error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }
}
