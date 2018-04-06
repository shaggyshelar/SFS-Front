import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ConfirmationService } from 'primeng/primeng';
import { GlobalErrorHandler } from './../../../../../../_services/error-handler.service';
import { MessageService } from './../../../../../../_services/message.service';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Helpers } from "./../../../../../../helpers";
import { InvoiceService } from '../../../_services/index';
@Component({
    selector: "app-invoice-list",
    templateUrl: "./invoice-list.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class InvoiceListComponent implements OnInit {
    invoiceList = [];
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
    searchValue: string; //HTML values
    selectedPageSize: number = 25; //HTML values
    constructor(private router: Router,
        private messageService: MessageService,
        private globalErrorHandler: GlobalErrorHandler,
        private confirmationService: ConfirmationService,
        private invoiceService: InvoiceService,
        private _script: ScriptLoaderService) {
    }

    ngOnInit() {
        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
        } else {
            //Default variable initialization
            this.perPage = this.invoiceService.perPage;
            this.currentPos = this.invoiceService.currentPos;
            this.currentPageNumber = this.invoiceService.currentPageNumber;
            this.selectedPageSize = this.perPage;
            this.url = '';
            this.sortUrl = '&filter[order]=id ASC';
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
            this.longList = true;
            //this.getAllBoards();
            this.status = this.invoiceService.status;
            this.startDate = this.invoiceService.startDate;
            this.endDate = this.invoiceService.endDate;
            if(this.status === 'Select' && this.startDate === undefined && this.endDate === undefined){
                this.getDataCount('');
            }else{
                this.getrecordsByFilter();
            }
        }
        //Page Size Array
        this.pageSize = [];
        this.pageSize.push({ label: '25', value: 25 });
        this.pageSize.push({ label: '50', value: 50 });
        this.pageSize.push({ label: '100', value: 100 });
        this.pageSize.push({ label: '200', value: 200 });
    }

    getDataCount(url) {
        this.invoiceService.getInvoicesCount(url).subscribe(
            response => {
                this.total = response.count;
                this.pages = Math.ceil(this.total / this.perPage);
                this.generateCount();
                this.setDisplayPageNumberRange();
                this.getAllInvoice();
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    getAllInvoice() {
        Helpers.setLoading(true);
        this.getUrl();
        this.invoiceService.getAllInvoices(this.url).subscribe(
            response => {
                this.invoiceList = response;
                this.longList = response.length > 0 ? true : false;
                if (!this.longList) {
                    this.firstPageNumber = 0;
                }
                Helpers.setLoading(false);
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }
    onStatusChange() {
        if (this.status) {
            this.currentPos = 0;
            this.currentPageNumber = 1;
            this.boundryStart = 1;
            this.boundry = 3;
            this.boundryEnd = this.boundry;
            this.getrecordsByFilter();
        }
    }

    setStartDate(value) {
        if (value) {
            this.startDate = value;
            if ((this.endDate) && (this.startDate < this.endDate)) {
                this.searchString('', false);
            }
            else if(this.endDate && (this.startDate > this.endDate)) {
                this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Start Date should be less than End Date' });
            }
        }
    }

    setEndDate(value) {
        if (value) {
            this.endDate = value;
            if ((this.startDate) && (this.startDate < this.endDate)) {
                this.searchString('', false);
            }
             else if(this.startDate && (this.startDate > this.endDate)) {
                this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'End Date should be greater than Start Date' });
            }
        }
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
    onInvoiceClick(id) {
        this.invoiceService.perPage = this.perPage;
        this.invoiceService.currentPos = this.currentPos;
        this.invoiceService.currentPageNumber = this.currentPageNumber;
        this.invoiceService.status = this.status;
        this.invoiceService.startDate = this.startDate;
        this.invoiceService.endDate = this.endDate;
        this.router.navigate(['/features/invoice/summary/' + id]);
    }
    moreNextPages() {
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
        if (this.boundryStart - this.boundry > 0) {
            this.boundryStart = this.boundryStart - this.boundry;
            this.boundryEnd = this.boundryStart + this.boundry - 1;
            this.currentPageNumber = this.boundryEnd;
            this.getQueryDataCount();
        }
    }

    pageSizeChanged(size) {
        this.perPage = size;
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
        this.getQueryDataCount();
    }

    visitFirstPage() {
        if (this.boundryStart > this.boundry) {
            this.currentPos = 0;
            this.currentPageNumber = 1;
            this.boundryStart = 1;
            this.boundryEnd = this.boundry;
            this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllInvoice();
        }
    }

    visitLastPage() {
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
        this.getAllInvoice();
    }

    backPage() {
        if (this.currentPos - this.perPage >= 0) {
            this.currentPos -= this.perPage;
            this.currentPageNumber--;
            this.setDisplayPageNumberRange();
            this.getAllInvoice();
        }
        else {
            this.currentPos = 0;
            this.currentPageNumber = 1;
        }
    }
    nextPage() {
        if (this.currentPos + this.perPage < this.total) {
            this.currentPos += this.perPage;
            this.currentPageNumber++;
            this.boundryStart++;
            // if (this.boundryStart > this.boundryEnd) {
            //     this.boundryStart--;
            //     this.moreNextPages();
            // }
            this.setDisplayPageNumberRange();
            this.getAllInvoice();
        }
    }

    pageClick(pageNumber) {
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

    /* Filtering, Sorting, Search functions Starts*/
    searchString(searchString, isPageChange) {
        if (searchString == '' && !isPageChange) {
            this.searchQuery = '';
            this.searchCountQuery = '';

        }
        if (!isPageChange) {
            this.currentPos = 0;
            this.currentPageNumber = 1;
            this.boundryStart = 1;
            this.boundry = 3;
            this.boundryEnd = this.boundry;
            this.getrecordsByFilter();
        }

    }

    getrecordsByFilter() {
        let count = 0;
        this.searchQuery = '';
        this.searchCountQuery = '';
        if (this.searchValue && (!this.status && (!this.startDate || !this.endDate))) {
            this.searchQuery = '&filter[where][invoiceNumber][like]=%' + this.searchValue + "%";
            this.searchCountQuery = '&[where][invoiceNumber][like]=%' + this.searchValue + "%";
        }
        else if (this.searchValue && (this.status || (!this.startDate || !this.endDate))) {
            this.searchQuery = '&filter[where][and][0][invoiceNumber][like]=%' + this.searchValue + "%";
            this.searchCountQuery = '&[where][and][0][invoiceNumber][like]=%' + this.searchValue + "%";
            count++;
        }
        if (this.status && this.status != "Select" && (!this.startDate || !this.endDate) && count == 0) {
            this.searchQuery = this.searchQuery + '&filter[where][status][like]=%' + this.status + "%";
            this.searchCountQuery = this.searchCountQuery + '&[where][status][like]=%' + this.status + "%";
        }
        else if (this.status && this.status != "Select" && this.status && ((this.startDate && this.endDate) || count > 1)) {
            this.searchQuery = this.searchQuery + '&filter[where][and][' + count + '][status][like]=%' + this.status + "%";
            this.searchCountQuery = this.searchCountQuery + '&[where][and][' + count + '][status][like]=%' + this.status + "%";
            count++;
        }
        if (this.startDate && this.endDate && this.status && count == 0) {
            let newCount = count++;
            this.searchQuery = this.searchQuery + "&filter[where][and][" + count + "][dueDate][gte]=" + new Date(this.startDate).toISOString() + "&filter[where][and][" + newCount + "][dueDate][lte]=" + new Date(this.endDate.setHours(23)).toISOString();
            this.searchCountQuery = this.searchCountQuery + "&[where][and][" + count + "][dueDate][gte]=" + new Date(this.startDate).toISOString() + "&[where][and][" + newCount + "][dueDate][lte]=" + new Date(this.endDate.setHours(23)).toISOString();
        }
        else if (count == 0 && this.startDate && this.endDate) {
            let newCount = count++;
            this.searchQuery = this.searchQuery + "&filter[where][and][" + count + "][dueDate][gte]=" + new Date(this.startDate).toISOString() + "&filter[where][and][" + newCount + "][dueDate][lte]=" + new Date(this.endDate.setHours(23)).toISOString();
            this.searchCountQuery = this.searchCountQuery + "&[where][and][" + count + "][dueDate][gte]=" + new Date(this.startDate).toISOString() + "&[where][and][" + newCount + "][dueDate][lte]=" + new Date(this.endDate.setHours(23)).toISOString();
        }
        else if (count > 0 && this.startDate && this.endDate) {
            let newCount = count++;
            this.searchQuery = this.searchQuery + "&filter[where][and][" + count + "][dueDate][gte]=" + new Date(this.startDate.setHours(22)).toISOString() + "&filter[where][and][" + newCount + "][dueDate][lte]=" + new Date(this.endDate.setHours(22)).toISOString();
            this.searchCountQuery = this.searchCountQuery + "&[where][and][" + count + "][dueDate][gte]=" + new Date(this.startDate.setHours(22)).toISOString() + "&[where][and][" + newCount + "][dueDate][lte]=" + new Date(this.endDate.setHours(22)).toISOString();
        }

        this.getQueryDataCount();
    }

    sort(column, sortOrder) {
        if (sortOrder) {
            this.sortUrl = '&filter[order]=' + column + ' DESC';
        } else {
            this.sortUrl = '&filter[order]=' + column + ' ASC';
        }
        this.getAllInvoice();
    }
    /* Filtering, Sorting, Search functions Ends*/

    /* Counting Number of records starts*/
    getQueryDataCount() {
        this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.searchCountQuery;
        this.getDataCount(this.countQuery);
    }

    getUrl() {
        let currentPos = this.currentPos > -1 ? this.currentPos : 0;
        this.url = '?filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.sortUrl + this.searchQuery;
    }
    /* Counting Number of records ends*/
}