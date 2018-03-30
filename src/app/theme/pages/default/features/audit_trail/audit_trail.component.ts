import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../_services/message.service';
import { ViewChild } from '@angular/core';
import { Helpers } from "../../../../../helpers";
import { ConfirmationService } from 'primeng/primeng';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { ClassService } from '../../_services/class.service';
import { FormatService } from '../../_services/tableToXls/format.service';
import { DataGridUtil } from '../../_services/tableToXls/datagrid.util';
import { CommonService } from '../../_services/common.service';
import * as _ from 'lodash/index';

@Component({
    selector: "audit_trail",
    templateUrl: "./audit_trail.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AuditTrailComponent implements OnInit {
    auditList = [];
    popupVisible:boolean = false;
    selectedRow:{id:0,schoolName:'',old:string,new:string};
    total: number;         //Number Of records
    currentPos: number;    //Current Page
    perPage: number;       //Number of records to be displayed per page
    firstPageNumber: number;
    lastPage: number;
    startDate: Date;
    endDate: Date;
    status: string;
    currentPageNumber: number; //Stores Current Page Number
    url: string;           //Api url
    sortUrl: string;       //Sort Api Url
    pages: number;         //Number of pages in pagination
    arr: number[] = [];    //Array for Number of pages in pagination
    pageSize: any;         //10,20,30,50,100
    ascSortCol1: boolean;  //Sorting for Column1
    ascSortCol2: boolean;  //Sorting for Column2
    ascSortCol3: boolean;  //Sorting for Column3
    ascSortCol4: boolean;  //Sorting for Column4

    searchQuery: string;   //Search Api Query 
    countQuery: string;    //Count number of records query
    filter1CountQuery: string;  //Count number of records for filter1CountQuery
    filter2CountQuery: string;  //Count number of records for filter2CountQuery
    searchCountQuery: string;
    longList: boolean;     //To show now records found message
    prePageEnable: boolean; //To disable/enable prev page button
    nextPageEnable: boolean; //To disable/enable prev page button
    boundry: number;
    boundryStart: number;
    boundryEnd: number;
    recordNotFound : boolean = false;
    searchValue: string; //HTML values
    selectedPageSize: number = 25; //HTML values
    constructor(private router: Router,
        private messageService: MessageService,
        private globalErrorHandler: GlobalErrorHandler,
        private confirmationService: ConfirmationService,
        private commonService: CommonService,
        private _script: ScriptLoaderService) {
    }

    ngOnInit() {
        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
        } else {
            //Default variable initialization
            this.perPage = this.commonService.perPage;
            this.currentPos = this.commonService.currentPos;
            this.currentPageNumber = this.commonService.currentPageNumber;
            this.selectedPageSize = this.perPage;
            this.selectedRow={id:0,schoolName:'',old:'',new:''};
            this.popupVisible =false;
            this.url = '';
            this.sortUrl = '&filter[order]=createdOn DESC';
            this.ascSortCol1 = true;
            this.ascSortCol2 = true;
            this.ascSortCol3 = true;
            this.ascSortCol4 = true;
            this.searchQuery = '';
            this.searchCountQuery = '';
            this.countQuery = '?';
            this.filter1CountQuery = '';
            this.filter2CountQuery = '';
            this.lastPage = this.perPage;
            this.firstPageNumber = 1;
            this.prePageEnable = false;
            this.nextPageEnable = true;
            this.boundry = 3;
            this.boundryStart = 1;
            this.boundryEnd = this.boundry;
            this.longList = false;
            //this.getAllBoards();
            //this.getDataCount('');
        }
        //Page Size Array
        this.pageSize = [];
        this.pageSize.push({ label: '25', value: 25 });
        this.pageSize.push({ label: '50', value: 50 });
        this.pageSize.push({ label: '100', value: 100 });
        this.pageSize.push({ label: '200', value: 200 });
    }

    getDataCount(url) {
        this.commonService.getAuditCount(url).subscribe(
            response => {
                this.total = response.count;
                this.pages = Math.ceil(this.total / this.perPage);
                this.generateCount();
                this.setDisplayPageNumberRange();
                this.getAllAudit();
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    getAllAudit() {
        
        this.getUrl();
        this.commonService.getAllAudit(this.url).subscribe(
            response => {
                this.auditList = response;
                this.longList = true;
                this.recordNotFound = response.length == 0 ? true : false;
                if (!this.longList) {
                    this.firstPageNumber = 0;
                }
                if (this.recordNotFound ) {
                    this.firstPageNumber = 0;
                }
                Helpers.setLoading(false);
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    setStartDate(value) {
        if (value) {
            this.startDate = value;
            this.filter1CountQuery = '&[where][and][0][createdOn][gt] =' + new Date(this.startDate).toISOString();
        } else {
            this.filter1CountQuery = '';
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }

    setEndDate(value) {
        if (value) {
            this.endDate = value;
            this.filter2CountQuery = '&[where][and][1][createdOn][lt] =' + new Date(this.endDate.setHours(22)).toISOString();
        } else {
            this.filter2CountQuery = '';
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }
    /*Pagination Function's Starts*/

    currentPageCheck(pageNumber) {
        if (this.currentPageNumber == pageNumber)
            return true;
        else
            return false;
    }
    generateCount() {
        this.arr = [];
        // for (var index = 0; index < this.pages; index++) {
        //     this.arr[index] = index + 1;
        // }
        //If number of pages are less than the boundry
        if (this.pages < this.boundry) {
            this.boundry = this.pages;
            this.boundryEnd = this.pages;
        } else {
            this.boundry = 3;
        }

        for (var index = 0, j = this.boundryStart; j <= this.boundryEnd; index++ , j++) {
            this.arr[index] = j;
        }

        //for()
    }

    showPop(rowId){
        this.selectedRow = {id:0,schoolName:'',old:'',new:''};
        
        this.selectedRow = Object.assign({},_.filter(this.auditList,{id:rowId})[0]);
        this.selectedRow.old = JSON.stringify(JSON.parse(this.selectedRow.old), null, 2);
        this.selectedRow.new = JSON.stringify(JSON.parse(this.selectedRow.new), null, 2);
        this.popupVisible = !this.popupVisible;
    }

    moreNextPages() {
        Helpers.setLoading(true);
        if (this.boundryEnd + 1 <= this.pages) {
            this.boundryStart = this.boundryEnd + 1;
            this.currentPageNumber = this.boundryStart;
            if (this.boundryEnd + this.boundry >= this.pages) {
                this.boundryEnd = this.pages;
            } else {
                this.boundryEnd = this.boundryEnd + this.boundry;
            }
            this.getQueryDataCount();
        }
    }

    morePreviousPages() {
        Helpers.setLoading(true);
        if (this.boundryStart - this.boundry > 0) {
            this.boundryStart = this.boundryStart - this.boundry;
            this.boundryEnd = this.boundryStart + this.boundry - 1;
            this.currentPageNumber = this.boundryEnd;
            this.getQueryDataCount();
        }
    }

    pageSizeChanged(size) {
        Helpers.setLoading(true);
        this.perPage = size;
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
        this.getQueryDataCount();
    }

    visitFirstPage() {
        Helpers.setLoading(true);
        if (this.boundryStart > this.boundry) {
            this.currentPos = 0;
            this.currentPageNumber = 1;
            this.boundryStart = 1;
            this.boundryEnd = this.boundry;
            this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllAudit();
        }
    }

    visitLastPage() {
        Helpers.setLoading(true);
        for (var index = 0; this.currentPos + this.perPage < this.total; index++) {
            this.currentPos += this.perPage;
            this.currentPageNumber++;
        }
        this.boundryStart = 1;
        this.boundryEnd = this.boundry;
        for (var index = 0; this.boundryEnd + 1 <= this.pages; index++) {
            this.boundryStart = this.boundryEnd + 1;

            if (this.boundryEnd + this.boundry >= this.pages) {
                this.boundryEnd = this.pages;
                this.currentPageNumber = this.boundryEnd;
            } else {
                this.boundryEnd = this.boundryEnd + this.boundry;
                this.currentPageNumber = this.boundryEnd;
            }
        }
        //this.boundryEnd = this.pages;
        //this.boundryStart = this.pages - this.boundry + 1;

        this.generateCount();
        this.setDisplayPageNumberRange();
        this.getAllAudit();
    }

    backPage() {
        Helpers.setLoading(true);
        if (this.currentPos - this.perPage >= 0) {
            this.currentPos -= this.perPage;
            this.currentPageNumber--;
            this.setDisplayPageNumberRange();
            this.getAllAudit();
        }
        else {
            this.currentPos = 0;
            this.currentPageNumber = 1;
        }
    }
    nextPage() {
        Helpers.setLoading(true);
        if (this.currentPos + this.perPage < this.total) {
            this.currentPos += this.perPage;
            this.currentPageNumber++;
            this.boundryStart++;
            // if (this.boundryStart > this.boundryEnd) {
            //     this.boundryStart--;
            //     this.moreNextPages();
            // }
            this.setDisplayPageNumberRange();
            this.getAllAudit();
        }
    }

    pageClick(pageNumber) {
        Helpers.setLoading(true);
        this.currentPos = this.perPage * (pageNumber - 1);
        this.currentPageNumber = pageNumber;
        this.setDisplayPageNumberRange();
        this.getrecordsByFilter();
        //this.getAllInvoice();
    }

    noPrevPage() {
        if (this.currentPos > 0) {
            return true;
        }
        return false;
    }

    setDisplayPageNumberRange() {
        this.currentPos = this.perPage * (this.currentPageNumber - 1);

        if ((this.currentPageNumber * this.perPage) > this.total)
            this.lastPage = this.total;
        else
            this.lastPage = this.currentPageNumber * this.perPage;

        if (this.lastPage >= this.total) {
            this.lastPage = this.total;
        }

        this.firstPageNumber = 1 + this.currentPos;
    }

    noFwrdPage() {
        if (this.currentPos + this.perPage < this.total) {
            return true;
        }
        return false;
    }

    /* Pagination Function's Ends */



    getrecordsByFilter() {
        let count = 0;
        this.searchQuery = '';
        this.searchCountQuery = '';
        if (this.startDate && this.endDate) {
            let newCount = count++;
            this.searchQuery = this.searchQuery + "&filter[where][and][" + count + "][createdOn][gte]=" + new Date(this.startDate).toISOString() + "&filter[where][and][" + newCount + "][createdOn][lte]=" + new Date(this.endDate.setHours(23)).toISOString();
            this.searchCountQuery = this.searchCountQuery + "&[where][and][" + count + "][createdOn][gte]=" + new Date(this.startDate).toISOString() + "&[where][and][" + newCount + "][createdOn][lte]=" + new Date(this.endDate.setHours(23)).toISOString();
        }
        this.getQueryDataCount();
    }

    sort(column, sortOrder) {
        Helpers.setLoading(true);
        if (sortOrder) {
            this.sortUrl = '&filter[order]=' + column + ' DESC';
        } else {
            this.sortUrl = '&filter[order]=' + column + ' ASC';
        }
        this.getAllAudit();
    }
    /* Filtering, Sorting, Search functions Ends*/

    /* Counting Number of records starts*/
    getQueryDataCount() {
        this.countQuery = '?&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.filter1CountQuery + this.filter2CountQuery + this.searchCountQuery;
        this.getDataCount(this.countQuery);
    }

    getUrl() {
        let currentPos = this.currentPos > -1 ? this.currentPos : 0;
        this.url = '?&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + '&filter[where][and][0][createdOn][gt]=' + new Date(this.startDate).toISOString() + '&filter[where][and][1][createdOn][lt]=' + new Date(this.endDate.setHours(22)).toISOString()  + this.sortUrl + this.searchQuery;
    }
    /* Counting Number of records ends*/

    onSearchReport() {
        
        if (this.startDate && this.endDate) {

            if (this.startDate < this.endDate) {
                Helpers.setLoading(true);
                let currentPos = this.currentPos > -1 ? this.currentPos : 0;
                this.getUrl();
                this.getAllAudit();
                this.getQueryDataCount();
            } else {
                this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Start Date should be less than End Date' });
            }
        } else {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please select start date and end date' });
        }
    }
    exporttoCSV() {
        let exprtcsv: any[] = [];
        let columns: any[] = [
            {
                display: 'Invoice No',
                variable: 'invoiceNumber',
                filter: 'text',
            },
            {
                display: 'Date',
                variable: 'createdOn',
                filter: 'date'
            },
            {
                display: 'Type',
                variable: 'type',
                filter: 'text'
            }
            ,
            {
                display: 'First Name',
                variable: 'studentFirstName',
                filter: 'text'
            }
            ,
            {
                display: 'Last Name',
                variable: 'studentLastName',
                filter: 'text'
            }
            ,
            {
                display: 'Student Code',
                variable: 'studentCode',
                filter: 'text'
            }
            ,
            {
                display: 'Gr. No.',
                variable: 'grNumber',
                filter: 'text'
            }
            ,
            {
                display: 'Class',
                variable: 'className',
                filter: 'text'
            }
            ,
            {
                display: 'Division',
                variable: 'divisionName',
                filter: 'text'
            }
            ,
            {
                display: 'Fee Plan',
                variable: 'feePlanName',
                filter: 'text'
            },
            {
                display: 'Status',
                variable: 'status',
                filter: 'text'
            },
            {
                display: 'Amount',
                variable: 'totalChargeAmount',
                filter: 'text'
            }

        ];
        let url = '?filter[limit]=' + this.total + '&filter[skip]=' + this.currentPos + this.sortUrl;
        Helpers.setLoading(true);
        this.commonService.getAllAudit(url).subscribe(
            response => {
                Helpers.setLoading(false);
                let _tempList = response;
                let exportFileName: string = "AuditTrailReport_";
                (<any[]>JSON.parse(JSON.stringify(_tempList))).forEach(x => {
                    var obj = new Object();
                    var frmt = new FormatService();
                    for (var i = 0; i < columns.length; i++) {
                        let transfrmVal = frmt.transform(x[columns[i].variable], columns[i].filter);
                        obj[columns[i].display] = transfrmVal;
                    }
                    exprtcsv.push(obj);
                }
                );
                DataGridUtil.downloadcsv(exprtcsv, exportFileName);
            },
            error => {
                Helpers.setLoading(false);
                this.globalErrorHandler.handleError(error);
            });

    }
}