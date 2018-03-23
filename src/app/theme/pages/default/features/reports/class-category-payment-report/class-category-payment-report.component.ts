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
import { Student } from "../../../_models/student";
import { StudentService } from '../../../_services/student.service';
import { CategoriesService } from '../../../_services/categories.service';
import * as _ from 'lodash/index';
@Component({
    selector: "app-class-category-payment-report-list",
    templateUrl: "./class-category-payment-report.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ClassCategoryPaymentReportComponent implements OnInit {
    schoolList: any[];
    total: number;         //Number Of records
    currentPos: number;    //Current Page
    perPage: number;       //Number of records to be displayed per page
    firstPageNumber: number;
    lastPage: number;
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
    ascSortCol6: boolean;  //Sorting for Column6
    ascSortCol7: boolean;  //Sorting for Column7
    onSerchClick: boolean = false;
    onGridSearchKeyUp: boolean = false;
    filterCol1: any;       //Filter1 values 
    filterCol2: any;       //Filter2 values 
    filterCol3: any;
    filterQuery: string;   //Filter1 Api Query 
    filterQuery2: string;  //Filter2 Api Query 
    filterQuery3: string;
    filterQuery4: string;
    filterQuery5: string;
    searchQuery: string;   //Search Api Query 
    countQuery: string;    //Count number of records query
    filter1CountQuery: string;  //Count number of records for filter1CountQuery
    filter2CountQuery: string;  //Count number of records for filter2CountQuery
    filter3CountQuery: string;
    filter4CountQuery: string;
    filter5CountQuery: string;
    searchCountQuery: string;
    longList: boolean;     //To show now records found message
    prePageEnable: boolean; //To disable/enable prev page button
    nextPageEnable: boolean; //To disable/enable prev page button
    recordNotFound: boolean;
    boundry: number;
    boundryStart: number;
    boundryEnd: number;
    groupData = [];
    startDate: Date;
    endDate: Date;
    status: string = '';
    filterValue1: any; //HTML values
    filterValue2: any; //HTML values
    searchValue: any; //HTML values
    selectedPageSize: number = 25; //HTML values

    classList: any;
    categoryList: any;
    @ViewChild('fileupload')
    myInputVariable: any;

    myFile: any;
    constructor(private router: Router, private studentService: StudentService,
        private globalErrorHandler: GlobalErrorHandler, private messageService: MessageService,
        private classService: ClassService, private confirmationService: ConfirmationService, private categoriesService: CategoriesService,
        private invoiceService: InvoiceService
    ) {
    }

    ngOnInit() {
        this.schoolList = [];
        this.groupData = [];
        this.pageSize = [];
        this.filterCol1 = [];
        this.filterCol2 = [];
        this.filterCol3 = [];
        this.pageSize.push({ label: '25', value: 25 });
        this.pageSize.push({ label: '50', value: 50 });
        this.pageSize.push({ label: '100', value: 100 });
        this.pageSize.push({ label: '200', value: 200 });

        //Default variable initialization
        this.perPage = this.studentService.perPage;
        this.currentPos = this.studentService.currentPos;
        this.currentPageNumber = this.studentService.currentPageNumber;
        this.selectedPageSize = this.perPage;
        this.url = '';
        this.sortUrl = '&filter[order]=id ASC';
        this.ascSortCol1 = true;
        this.ascSortCol2 = true;
        this.ascSortCol3 = true;
        this.ascSortCol4 = true;
        this.ascSortCol5 = true;
        this.ascSortCol6 = true;
        this.ascSortCol7 = true;
        this.filterQuery = '';
        this.filterQuery2 = '';
        this.filterQuery3 = '';
        this.filterQuery4 = '';
        this.filterQuery5 = '';
        this.searchQuery = '';
        this.countQuery = '?';
        this.filter1CountQuery = '';
        this.filter2CountQuery = '';
        this.filter3CountQuery = '';
        this.filter4CountQuery = '';
        this.filter5CountQuery = '';
        this.lastPage = this.perPage;
        this.firstPageNumber = 1;
        this.prePageEnable = false;
        this.nextPageEnable = true;
        this.boundry = 3;
        this.boundryStart = 1;
        this.boundryEnd = this.boundry;
        this.searchCountQuery = '';
        this.longList = false;
        this.recordNotFound = false;

        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
        } else {
            //this.getDataCount('');
            //List of Classes
            this.filterCol1.push({ label: "All", value: "All" });
            let val = this.classService.getAllClasses();
            val.subscribe((response) => {
                for (let key in response) {
                    if (response.hasOwnProperty(key)) {
                        this.filterCol1.push({ label: response[key].className, value: response[key].id });
                    }
                }
                _.forEach(this.filterCol1, function (listItem) {
                    listItem.selected = true;
                });
            });

            //List of Categories
            this.filterCol2.push({ label: "All", value: "All" });
            val = this.categoriesService.getAllCategories();
            val.subscribe((response) => {
                for (let key in response) {
                    if (response.hasOwnProperty(key)) {
                        this.filterCol2.push({ label: response[key].categoryName, value: response[key].id });
                    }
                }
                _.forEach(this.filterCol2, function (listItem) {
                    listItem.selected = true;
                });
            });

            //List of Status
            this.filterCol3 = [
                { label: "All", value: "All" },
                { label: "Created", value: "Created" },
                { label: "Processed", value: "Processed" },
                { label: "Paid", value: "Paid" },
                { label: "Settled", value: "Settled" },
                { label: "Closed", value: "Closed" }
            ];
            _.forEach(this.filterCol3, function (listItem) {
                listItem.selected = true;
            });

        }

    }

    checkSelected(item: any, itemList: any) {
        if (item.value == 'All') {
            if (item.selected) {
                _.forEach(itemList, function (listItem) {
                    listItem.selected = true;
                });
            }
            else {
                _.forEach(itemList, function (listItem) {
                    listItem.selected = false;
                });
            }
        }
        else {
            if (itemList.length > 0)
                itemList[0].selected = true;

            _.forEach(itemList, function (listItem) {
                if (listItem.selected == false)
                    itemList[0].selected = false;
            });
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
        //this.generateCount();


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
            this.getAllStudents();
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
        this.getAllStudents();
    }

    backPage() {
        if (this.currentPos - this.perPage >= 0) {
            this.currentPos -= this.perPage;
            this.currentPageNumber--;

            // this.boundryStart--;
            // this.boundryEnd--;
            // this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllStudents();
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
            this.getAllStudents();
        }
    }

    pageClick(pageNumber) {
        this.currentPos = this.perPage * (pageNumber - 1);
        this.currentPageNumber = pageNumber;
        this.setDisplayPageNumberRange();
        this.getAllStudents();
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
            this.searchQuery = '&filter[where][or][0][studentFirstName][like]=%' + searchString + "%" + '&filter[where][or][1][studentMiddleName][like]=%' + searchString + "%" + '&filter[where][or][2][studentLastName][like]=%' + searchString + "%" + '&filter[where][or][3][gRNumber][like]=%' + searchString + "%" + '&filter[where][or][4][studentCode][like]=%' + searchString + "%";
            this.searchCountQuery = '&[where][or][0][studentFirstName][like]=%' + searchString + "%" + '&[where][or][1][studentMiddleName][like]=%' + searchString + "%" + '&[where][or][2][studentLastName][like]=%' + searchString + "%" + '&[where][or][3][gRNumber][like]=%' + searchString + "%" + '&[where][or][4][studentCode][like]=%' + searchString + "%";
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
        this.getQueryDataCount();
        //this.getAllSchools();
    }

    filterByClass() {
        // if (this.filterValue1 === 'Select') {
        //     this.filterQuery = '';
        //     this.filter1CountQuery = '';
        // } else {

        let vm = this;
        this.filterQuery ='';
        vm.filterValue1 = '';
        this.filter1CountQuery ='';
        let allSelected = false;
        this.filterCol1.forEach(function (element) {
            if (element.selected && element.value == 'All')
                allSelected = true;
            else if (element.selected && element.value != 'All' && !allSelected)
                vm.filterValue1 = vm.filterValue1 + element.value + ',';
        });
        if (vm.filterValue1 != '') {
            vm.filterValue1 = vm.filterValue1.substr(0, vm.filterValue1.length - 1);
            this.filterQuery = '&classIds=' + this.filterValue1;
            this.filter1CountQuery = '&where[classId] =' + this.filterValue1;
        }

        //}
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;

        //this.getQueryDataCount();
    }

    filterByCategory() {
        // if (this.filterValue2 === 'Select') {
        //     this.filterQuery2 = '';
        //     this.filter2CountQuery = '';
        // } else {
            this.filterQuery2 ='';
            this.filter2CountQuery ='';
        let vm = this;
        vm.filterValue2 = '';
        let allSelected = false;
        this.filterCol2.forEach(function (element) {
            if (element.selected && element.value == 'All')
                allSelected = true;
            else if (element.selected && element.value != 'All' && !allSelected)
                vm.filterValue2 = vm.filterValue2 + element.value + ',';
        });
        if (vm.filterValue2 != '') {
            vm.filterValue2 = vm.filterValue2.substr(0, vm.filterValue2.length - 1);
            this.filterQuery2 = '&categoryIds=' + this.filterValue2;
            this.filter2CountQuery = '&where[categoryId] =' + this.filterValue2;
        }
        //}
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
        //this.getQueryDataCount();
    }
    setStartDate(value) {
        if (value) {
            this.startDate = value;
            let date = new Date(this.startDate);
            let year = date.getFullYear();
            let month: any = date.getMonth() + 1;
            let dt: any = date.getDate();

            if (dt < 10) {
                dt = '0' + dt;
            }
            if (month < 10) {
                month = '0' + month;
            }
            let completeFromDate = year + '-' + month + '-' + dt;
            this.filterQuery3 = '&fromDate=' + completeFromDate;
            this.filter3CountQuery = '&[where][and][0][dueDate][gt] =' + new Date(this.startDate).toISOString();
        } else {
            this.filter3CountQuery = '';
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
            let date = new Date(this.endDate);
            let year = date.getFullYear();
            let month: any = date.getMonth() + 1;
            let dt: any = date.getDate();

            if (dt < 10) {
                dt = '0' + dt;
            }
            if (month < 10) {
                month = '0' + month;
            }
            let completeToDate = year + '-' + month + '-' + dt;
            this.filterQuery4 = '&toDate=' + completeToDate;
            this.filter4CountQuery = '&[where][and][1][dueDate][lt] =' + new Date(this.endDate.setHours(22)).toISOString();
        } else {
            this.filter4CountQuery = '';
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }
    onFilterByStatus() {
        this.filterQuery5 ='';
        this.filter5CountQuery = '';
        let vm = this;
        vm.status = '';
        let allSelected = false;
        this.filterCol3.forEach(function (element) {
            if (element.selected && element.value == 'All')
                allSelected = true;
            else if (element.selected && element.value != 'All' && !allSelected)
                vm.status = vm.status + element.value + ',';
        });
        if (vm.status != '') {
            vm.status = vm.status.substr(0, vm.status.length - 1);
            this.filterQuery5 = '&statuses=' + this.status;
            this.filter5CountQuery = '&where[status] =' + this.status;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
    }
    onSearchReport() {
        this.filterByClass();
        this.filterByCategory();
        this.onFilterByStatus();
        if (this.startDate && this.endDate) {
            if (this.startDate < this.endDate) {
                let currentPos = this.currentPos > -1 ? this.currentPos : 0;
                this.url = this.filterQuery + this.filterQuery2 + this.filterQuery3 + this.filterQuery4 + this.filterQuery5;
                this.getAllCategoryClassPaymentReport(this.url);
                //this.getQueryFilterDataCount();
            }
            else {
                this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Start Date should be less than End Date' });
            }
        }
        else {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please select start date and end date' });
        }
    }
    sort(column, sortOrder) {
        if (sortOrder) {
            this.sortUrl = '&filter[order]=' + column + ' DESC';
        } else {
            this.sortUrl = '&filter[order]=' + column + ' ASC';
        }
        this.getAllStudents();
    }
    /* Filtering, Sorting, Search functions Ends*/

    /* Counting Number of records starts*/
    getQueryDataCount() {
        this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.searchCountQuery;
        this.getDataCount(this.countQuery);

    }
    getQueryFilterDataCount() {
        this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.searchCountQuery;
        this.getFilterDataCount(this.countQuery);

    }
    getDataCount(url) {
        this.studentService.getStudentCount(url).subscribe((response) => {
            this.total = response.count;
            this.pages = Math.ceil(this.total / this.perPage);
            this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllStudents();
        },
            error => {
                this.globalErrorHandler.handleError(error);
                Helpers.setLoading(false);
            }
        );
    }
    getFilterDataCount(url) {
        this.studentService.getStudentCount(url).subscribe((response) => {
            this.total = response.count;
            this.pages = Math.ceil(this.total / this.perPage);
            this.generateCount();
            this.setDisplayPageNumberRange();
        },
            error => {
                this.globalErrorHandler.handleError(error);
                Helpers.setLoading(false);
            }
        );
    }
    getUrl() {
        let currentPos = this.currentPos > -1 ? this.currentPos : 0;
        this.url = '?filter[include]=StudentClass&filter[include]=StudentCategory&filter[include]=StudentDivision&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.filterQuery + this.filterQuery2 + this.sortUrl + this.searchQuery;
    }
    /* Counting Number of records ends*/


    getAllStudents() {
        //this.schoolList = this.studentService.getAllStudents();      
        this.getUrl();
        Helpers.setLoading(true);
        this.studentService.getAllStudents(this.url).subscribe(
            response => {
                Helpers.setLoading(false);
                this.schoolList = response['_students'];
                if (!this.onGridSearchKeyUp) {
                    this.recordNotFound = false;
                    this.longList = response['_students'].length > 0 ? true : false;
                    if (!this.longList) {
                        this.firstPageNumber = 0;
                    }
                } else {
                    this.recordNotFound = response['_students'].length > 0 ? false : true;
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
    getAllCategoryClassPaymentReport(url) {
        let vm = this;
        Helpers.setLoading(true);
        this.invoiceService.getAllCategoryClassPaymentReport(this.url).subscribe(
            response => {

                Helpers.setLoading(false);
                this.schoolList = response.result;


                // var uniqClassName = _.uniqBy(response.result, 'className');
                // _.forEach(uniqClassName, function (value) {
                //     var tempDataList = _.filter(response.result, function (o) {
                //         return o.className === value.className;
                //     });
                //     let dataObj = {
                //         name: value.className,
                //         data: tempDataList
                //     }
                //     vm.groupData.push(dataObj);
                // });
                // console.log(this.groupData);

                this.longList = response.result.length > 0 ? true : false;
                if (!this.longList) {
                    this.onSerchClick = true;
                    this.firstPageNumber = 0;
                }
            },
            error => {
                Helpers.setLoading(false);
                this.globalErrorHandler.handleError(error);
            });
    }
    exporttoCSV() {
        let exprtcsv: any[] = [];
        let columns: any[] = [
            {
                display: 'Gr.No.',
                variable: 'gRNumber',
                filter: 'text',
            },
            {
                display: 'Student Code',
                variable: 'studentCode',
                filter: 'text'
            },
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
                display: 'Category',
                variable: 'StudentCategory.categoryName',
                filter: 'text'
            }
            ,
            {
                display: 'Class',
                variable: 'StudentClass.className',
                filter: 'text'
            }
            ,
            {
                display: 'Division',
                variable: 'StudentDivision.divisionName',
                filter: 'text'
            }
            ,
            {
                display: 'Gender',
                variable: 'studentGender',
                filter: 'text'
            },
            {
                display: 'Email',
                variable: 'email',
                filter: 'text'
            },
            {
                display: 'Father First Name ',
                variable: 'fatherFirstName',
                filter: 'text'
            },
            {
                display: 'Father Last Name',
                variable: 'fatherLastName',
                filter: 'text',
            },
            {
                display: 'Father Mobile',
                variable: 'fatherMobile',
                filter: 'text'
            },
            {
                display: 'Mother First Name',
                variable: 'motherFirstName',
                filter: 'text'
            }
            ,
            {
                display: 'Mother Last Name',
                variable: 'motherLastName',
                filter: 'text'
            }
            ,
            {
                display: 'Mother Mobile',
                variable: 'motherMobile',
                filter: 'text'
            }
            ,
            {
                display: 'Guardian FirstName',
                variable: 'guardianFirstName',
                filter: 'text'
            }
            ,
            {
                display: 'Guardian Last Name',
                variable: 'guardianLastName',
                filter: 'text'
            }
            ,
            {
                display: 'Guardian Mobile',
                variable: 'guardianMobile',
                filter: 'text'
            },
            {
                display: 'Academic Year',
                variable: 'academicYear',
                filter: 'text'
            },
            {
                display: 'City',
                variable: 'city',
                filter: 'text'
            },
            {
                display: 'State',
                variable: 'state',
                filter: 'text'
            }
            ,
            {
                display: 'DOB',
                variable: 'studentDateOfBirth',
                filter: 'date'
            }
            ,
            {
                display: 'DOJ',
                variable: 'dateOfJoining',
                filter: 'date'
            },
            {
                display: 'Phone',
                variable: 'phone',
                filter: 'text'
            },
            {
                display: 'Blood Group',
                variable: 'bloodGroup',
                filter: 'text'
            }

        ];

        let url = '?filter[limit]=' + this.total + '&filter[skip]=' + this.currentPos + this.sortUrl;
        Helpers.setLoading(true);
        this.studentService.getAllStudents(this.url).subscribe(
            response => {
                Helpers.setLoading(false);
                let _tempList = response['_students'];
                let exportFileName: string = "StudentCategoryReport_";
                (<any[]>JSON.parse(JSON.stringify(_tempList))).forEach(x => {
                    var obj = new Object();
                    var frmt = new FormatService();
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i].variable.indexOf(".") > -1) {
                            let transfrmVal = frmt.transform(x[columns[i].variable.split(".")[0]][columns[i].variable.split(".")[1]], columns[i].filter);
                            obj[columns[i].display] = transfrmVal;
                        } else {
                            let transfrmVal = frmt.transform(x[columns[i].variable], columns[i].filter);
                            obj[columns[i].display] = transfrmVal;
                        }
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
    calculateGroupTotal(categoryid: string) {
        let total = 0;

        if (this.schoolList) {
            for (let school of this.schoolList) {
                if (school.categoryid === categoryid) {
                    total += school.amount;
                }
            }
        }

        return total;
    }
}