import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { School } from "../../../_models/school";
import { Merchant } from "../../../_models/merchant";
import { ViewChild } from '@angular/core';
import { Helpers } from "../../../../../../helpers";
import { UserSchoolDetailsService } from '../../../../default/_services/userschooldetails.service';
import { MerchantService } from '../../../../default/_services/merchant.service';
import { ConfirmationService } from 'primeng/primeng';
import { InvoiceService } from '../../../_services/index';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { ClassService } from '../../../_services/class.service';
import { FormatService } from '../../../_services/tableToXls/format.service';
import { DataGridUtil } from '../../../_services/tableToXls/datagrid.util';
import * as _ from 'lodash/index';
@Component({
    selector: "app-student-invoice-report-list",
    templateUrl: "./student-invoice-report.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class StudentInvoiceReportComponent implements OnInit {
    classList: any = [];
    divisionList: any = [];
    _tempDivisionList: any = [];
    invoiceList = [];
    feeplanList = [];
    categoryList = [];
    total: number;         //Number Of records
    currentPos: number;    //Current Page
    perPage: number;       //Number of records to be displayed per page
    firstPageNumber: number;
    lastPage: number;
    startDate: Date;
    endDate: Date;
    status: string = '';
    class: string = '';
    division: string = '';
    feeplan: string = '';
    type: string = '';
    category: string = '';
    schoolId: any;
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
    ascSortCol5: boolean;  //Sorting for Column5

    onSerchClick: boolean = false;
    onGridSearchKeyUp: boolean = false;
    searchQuery: string;   //Search Api Query 
    countQuery: string;    //Count number of records query
    filterQuery: string;
    filterQuery1: string;
    filterQuery2: string;
    filterQuery3: string;
    filterQuery4: string;
    filterQuery5: string;
    filter1CountQuery: string;  //Count number of records for filter1CountQuery
    filter2CountQuery: string;  //Count number of records for filter2CountQuery
    filter3CountQuery: string;
    filter4CountQuery: string;
    filter5CountQuery: string;
    filter6CountQuery: string;
    filter7CountQuery: string;
    filter8CountQuery: string;
    searchCountQuery: string;
    longList: boolean;     //To show now records found message
    prePageEnable: boolean; //To disable/enable prev page button
    nextPageEnable: boolean; //To disable/enable prev page button
    recordNotFound: boolean;
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
        private classService: ClassService,
        private _script: ScriptLoaderService) {
    }

    ngOnInit() {
        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
            this.router.navigate(['/selectSchool']);
        } else {
            //Default variable initialization
            this.perPage = 100;
            this.currentPos = 0;
            this.currentPageNumber = 1;
            this.selectedPageSize = this.perPage;
            this.schoolId = localStorage.getItem("schoolId");
            this.url = '';
            this.sortUrl = '&filter[order]=id ASC';
            this.ascSortCol1 = true;
            this.ascSortCol2 = true;
            this.ascSortCol3 = true;
            this.ascSortCol4 = true;
            this.ascSortCol5 = true;
            this.filterQuery = '';
            this.filterQuery1 = '';
            this.filterQuery2 = '';
            this.filterQuery3 = '';
            this.filterQuery4 = '';
            this.filterQuery5 = '';
            this.searchQuery = '';
            this.searchCountQuery = '';
            this.countQuery = '?';
            this.filter1CountQuery = '';
            this.filter2CountQuery = '';
            this.filter3CountQuery = '';
            this.filter4CountQuery = '';
            this.filter5CountQuery = '';
            this.filter6CountQuery = '';
            this.filter7CountQuery = '';
            this.filter8CountQuery = '';
            this.lastPage = this.perPage;
            this.firstPageNumber = 1;
            this.prePageEnable = false;
            this.nextPageEnable = true;
            this.boundry = 3;
            this.boundryStart = 1;
            this.boundryEnd = this.boundry;
            this.longList = false;
            this.recordNotFound = false;
            //this.getAllBoards();
            this.getClassList();
            this.getDivisionList();
            this.getFeePlanList();
            this.getCategoryList();
            //this.getDataCount('');
        }
        //Page Size Array
        this.pageSize = [];
        this.pageSize.push({ label: '100', value: 100 });
        this.pageSize.push({ label: '200', value: 200 });
        this.pageSize.push({ label: '300', value: 300 });
        this.pageSize.push({ label: '400', value: 400 });
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
                variable: 'dueDate',
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
        this.invoiceService.getAllStudentInvoiceReport(url).subscribe(
            response => {
                Helpers.setLoading(false);
                let _tempList = response;
                let exportFileName: string = "StudentInvoiceReport_";
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

    getDataCount(url) {
        Helpers.setLoading(true);
        this.invoiceService.getStudentInvoiceReportCount(url).subscribe(
            response => {
                this.total = response.count;
                this.pages = Math.ceil(this.total / this.perPage);
                this.generateCount();
                this.setDisplayPageNumberRange();
                this.onSearchReport();
                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
                this.globalErrorHandler.handleError(error);
            });
    }
    getFilteredDataCount(url) {
        this.invoiceService.getStudentInvoiceReportCount(url).subscribe(
            response => {
                this.total = response.count;
                this.pages = Math.ceil(this.total / this.perPage);
                this.generateCount();
                this.setDisplayPageNumberRange();
                //this.onSearchReport();
                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
                this.globalErrorHandler.handleError(error);
            });
    }
    getClassList() {
        this.classService.getClassBySchoolId(this.schoolId)
            .subscribe(
                response => {
                    this.classList = response;
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                }
            );
    }
    getDivisionList() {
        this.classService.getDivisionBySchoolId(this.schoolId)
            .subscribe(
                response => {
                    this.divisionList = [];
                    this._tempDivisionList = _.cloneDeep(response);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                }
            );
    }
    getFeePlanList() {
        this.classService.getFeePlansBySchoolId(this.schoolId)
            .subscribe(
                response => {
                    this.feeplanList = response;
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                }
            );
    }
    getCategoryList() {
        this.classService.getCategoryBySchoolId(this.schoolId)
            .subscribe(
                response => {
                    this.categoryList = response;
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                }
            );
    }
    getAllInvoice() {
        this.getUrl();
        this.invoiceService.getAllStudentInvoiceReport(this.url).subscribe(
            response => {
                Helpers.setLoading(false);
                this.invoiceList = response;
                if (!this.onGridSearchKeyUp) {
                    this.recordNotFound = false;
                    this.longList = response.length > 0 ? true : false;
                    if (!this.longList) {
                        this.firstPageNumber = 0;
                    }
                } else {
                    this.recordNotFound = response.length > 0 ? false : true;
                    if (this.recordNotFound) {
                        this.firstPageNumber = 0;
                    }
                }
            },
            error => {
                Helpers.setLoading(false);
                this.globalErrorHandler.handleError(error);
            });
    }
    getAllStudentInvoiceReport(url) {
        this.invoiceService.getAllStudentInvoiceReport(url).subscribe(
            response => {
                this.invoiceList = response;
                this.longList = response.length > 0 ? true : false;
                if (!this.longList) {
                    this.onSerchClick = true;
                    this.firstPageNumber = 0;
                }
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    setStartDate(value) {
        if (value) {
            this.startDate = value;
            this.filter5CountQuery = '&[where][and][0][dueDate][gt] =' + new Date(this.startDate).toISOString();
        } else {
            this.filter5CountQuery = '';
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
            this.filter6CountQuery = '&[where][and][1][dueDate][lt] =' + new Date(this.endDate).toISOString();
        } else {
            this.filter6CountQuery = '';
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
            this.onSearchReport();
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
        this.onSearchReport();
    }

    backPage() {
        if (this.currentPos - this.perPage >= 0) {
            this.currentPos -= this.perPage;
            this.currentPageNumber--;
            this.setDisplayPageNumberRange();
            this.onSearchReport();
        }
        else {
            this.currentPos = 0;
            this.currentPageNumber = 1;
        }
    }
    onInvoiceClick(id) {
        this.invoiceService.perPage = this.perPage;
        this.invoiceService.currentPos = this.currentPos;
        this.invoiceService.currentPageNumber = this.currentPageNumber;
        this.router.navigate(['/features/invoice/summary/' + id]);
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
            this.onSearchReport();
        }
    }

    pageClick(pageNumber) {
        this.currentPos = this.perPage * (pageNumber - 1);
        this.currentPageNumber = pageNumber;
        this.setDisplayPageNumberRange();
        this.onSearchReport();
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
    searchString(searchString) {
        if (searchString == '') {
            this.searchQuery = '';
            this.searchCountQuery = '';
            this.onGridSearchKeyUp = false;
        } else {
            this.onGridSearchKeyUp = true;
            this.searchQuery = '&filter[where][or][0][invoiceNumber][like]=%' + searchString + "%" + '&filter[where][or][1][status][like]=%' + searchString + "%" + '&filter[where][or][2][gRNumber][like]=%' + searchString + "%" + '&filter[where][or][3][studentCode][like]=%' + searchString + "%";
            this.searchCountQuery = '&where[or][0][invoiceNumber][like]=%' + searchString + "%" + '&where[or][1][status][like]=%' + searchString + "%" + '&[where][or][2][gRNumber][like]=%' + searchString + "%" + '&[where][or][3][studentCode][like]=%' + searchString + "%";;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
        this.getSearchQueryData();
    }
    onFilterByStatus(column, value) {
        if (value === '') {
            this.filterQuery = '';
            this.filter1CountQuery = '';
        } else {
            this.filterQuery = '&filter[where][' + column + ']=' + value;
            this.filter1CountQuery = '&where[' + column + '] =' + value;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }
    onFilterByClass(column, value) {
        if (value === '') {
            this.filterQuery1 = '';
            this.filter2CountQuery = '';
            this.divisionList = [];
            this.division = '';
        } else {
            this.division = '';
            this.filterQuery2 = '';
            this.filter3CountQuery = '';
            this.divisionList = _.filter(this._tempDivisionList, { classId: Number(value) });
            this.filterQuery1 = '&filter[where][' + column + ']=' + value;
            this.filter2CountQuery = '&where[' + column + '] =' + value;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }
    onFilterByDivision(column, value) {
        if (value === '') {
            this.filterQuery2 = '';
            this.filter3CountQuery = '';
        } else {
            this.filterQuery2 = '&filter[where][' + column + ']=' + value;
            this.filter3CountQuery = '&where[' + column + '] =' + value;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }
    onFilterByFeePlan(column, value) {
        if (value === '') {
            this.filterQuery3 = '';
            this.filter4CountQuery = '';
        } else {
            this.filterQuery3 = '&filter[where][' + column + ']=' + value;
            this.filter4CountQuery = '&where[' + column + '] =' + value;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }
    onFilterBytype() {
        if (this.type === '') {
            this.filterQuery4 = '';
            this.filter7CountQuery = '';
        } else {
            this.filterQuery4 = '&filter[where][type]=' + this.type;
            this.filter7CountQuery = '&where[type] =' + this.type;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }
    onFilterByCategory() {
        if (this.category === '') {
            this.filterQuery5 = '';
            this.filter8CountQuery = '';
        } else {
            this.filterQuery5 = '&filter[where][categoryid]=' + this.category;
            this.filter8CountQuery = '&where[categoryid] =' + this.category;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }
    sort(column, sortOrder) {
        if (sortOrder) {
            this.sortUrl = '&filter[order]=' + column + ' DESC';
        } else {
            this.sortUrl = '&filter[order]=' + column + ' ASC';
        }
        this.onSearchReport();
    }
    /* Filtering, Sorting, Search functions Ends*/

    /* Counting Number of records starts*/
    getQueryDataCount() {
        if (this.startDate && this.endDate) {
            this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.filter3CountQuery + this.filter4CountQuery + this.filter5CountQuery + this.filter6CountQuery + this.filter7CountQuery + this.filter8CountQuery + this.searchCountQuery;
            this.getFilteredDataCount(this.countQuery);
        }
        else {
            this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.filter3CountQuery + this.filter4CountQuery + this.filter7CountQuery + this.filter8CountQuery + this.searchCountQuery;
            this.getFilteredDataCount(this.countQuery);
        }

    }
    getSearchQueryData() {
        if (this.startDate && this.endDate) {
            this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.filter3CountQuery + this.filter4CountQuery + this.filter5CountQuery + this.filter6CountQuery + this.filter7CountQuery + this.filter8CountQuery + this.searchCountQuery;
            this.getDataCount(this.countQuery);
        }
        else {
            this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.filter3CountQuery + this.filter4CountQuery + this.filter7CountQuery + this.filter8CountQuery + this.searchCountQuery;
            this.getDataCount(this.countQuery);
        }

    }

    getUrl() {
        let currentPos = this.currentPos > -1 ? this.currentPos : 0;
        this.url = '?filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.filterQuery + this.filterQuery1 + this.filterQuery2 + this.filterQuery3 + this.filterQuery4 + this.filterQuery5 + this.sortUrl + this.searchQuery;
    }
    onSearchReport() {
            if (this.startDate && this.endDate) {
                if (this.startDate < this.endDate) {
                    let currentPos = this.currentPos > -1 ? this.currentPos : 0;
                    this.url = '?&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + '&filter[where][and][0][dueDate][gt]=' + new Date(this.startDate).toISOString() + '&filter[where][and][1][dueDate][lt]=' + new Date(this.endDate).toISOString() + this.filterQuery + this.filterQuery1 + this.filterQuery2 + this.filterQuery3 + this.filterQuery4 + this.filterQuery5 + this.sortUrl + this.searchQuery;
                    this.getAllStudentInvoiceReport(this.url);
                    this.getQueryDataCount();
                } else {
                    this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Start Date should be less than End Date' });
                }
            } else {
                let currentPos = this.currentPos > -1 ? this.currentPos : 0;
                this.url = '?&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.filterQuery + this.filterQuery1 + this.filterQuery2 + this.filterQuery3 + this.filterQuery4 + this.filterQuery5 + this.sortUrl + this.searchQuery;
                this.getAllStudentInvoiceReport(this.url);
                this.getQueryDataCount();
            }
        }
    /* Counting Number of records ends*/
}