import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ConfirmationService } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { ClassService } from '../../../../_services/class.service';
import { SchoolClass } from "../../../../_models/class";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./class-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ClassListComponent implements OnInit {
    classList: Observable<SchoolClass[]>;
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
    filterCol1: any;       //Filter1 values 
    filterCol2: any;       //Filter2 values 
    filterQuery: string;   //Filter1 Api Query 
    filterQuery2: string;  //Filter2 Api Query 
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

    filterValue1: string; //HTML values
    filterValue2: string; //HTML values
    searchValue: string; //HTML values
    selectedPageSize: number = 25; //HTML values
    constructor(private router: Router,
        private messageService: MessageService,
        private globalErrorHandler: GlobalErrorHandler,
        private _script: ScriptLoaderService,
        private classService: ClassService,
        private confirmationService: ConfirmationService,

    ) {
    }

    ngOnInit() {
        //Page Size Array
        this.pageSize = [];
        this.pageSize.push({ label: '25', value: 25 });
        this.pageSize.push({ label: '50', value: 50 });
        this.pageSize.push({ label: '100', value: 100 });
        this.pageSize.push({ label: '200', value: 200 });



        //Default variable initialization
        this.perPage = this.classService.perPage;
        this.currentPos = this.classService.currentPos;
        this.currentPageNumber = this.classService.currentPageNumber;
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
        this.searchQuery = '';
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
        this.searchCountQuery = '';
        this.longList = true;
        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
        } else {
            this.getAllClasses();
            this.getDataCount('');
        }
    }

    getAllClasses() {
        Helpers.setLoading(true);
        this.getUrl();

        this.classList = this.classService.getAllClassList(this.url);

        this.classList.subscribe((response) => {
            console.log(response);
            this.longList = response.length > 0 ? true : false;
            if (!this.longList) {
                this.firstPageNumber = 0;
            }
            Helpers.setLoading(false);
        }, error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
        });
    }

    onEditClassClick(schoolClass: SchoolClass) {
        this.classService.perPage = this.perPage;
        this.classService.currentPos = this.currentPos;
        this.classService.currentPageNumber = this.currentPageNumber;
        this.router.navigate(['/features/class/edit', schoolClass.id]);
    }
    onClassDeleteClick(schoolClass: SchoolClass) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.classService.deleteClass(schoolClass.id).subscribe(
                    results => {
                        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
                        if ((this.currentPageNumber - 1) * this.perPage == (this.total - 1)) {
                            this.currentPageNumber--;
                        }
                        this.getQueryDataCount();
                    },
                    error => {
                        this.globalErrorHandler.handleError(error);
                    })
            },
            reject: () => {
            }
        });
    }
    onAddClass() {
        this.router.navigate(['/features/class/add']);
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
            this.getAllClasses();
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
        this.getAllClasses();
    }

    backPage() {
        if (this.currentPos - this.perPage >= 0) {
            this.currentPos -= this.perPage;
            this.currentPageNumber--;

            // this.boundryStart--;
            // this.boundryEnd--;
            // this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllClasses();
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
            this.getAllClasses();
        }
    }

    pageClick(pageNumber) {
        this.currentPos = this.perPage * (pageNumber - 1);
        this.currentPageNumber = pageNumber;
        this.setDisplayPageNumberRange();
        this.getAllClasses();
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
        } else {
            this.searchQuery = '&filter[where][SchoolName][ilike]=' + searchString;
            this.searchCountQuery = '&[where][SchoolName][like]=' + searchString;
        }
        this.getQueryDataCount();
        //this.getAllSchools();
    }

    filterByValue(column, value) {
        if (value == 'select') {
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

        this.getQueryDataCount();
    }

    filterByValue2(column, value) {
        if (value == 'select') {
            this.filterQuery2 = '';
            this.filter2CountQuery = '';
        } else {
            this.filterQuery2 = '&filter[where][' + column + ']=' + value;
            this.filter2CountQuery = '&where[' + column + '] =' + value;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
        this.getQueryDataCount();
    }

    sort(column, sortOrder) {
        if (sortOrder) {
            this.sortUrl = '&filter[order]=' + column + ' DESC';
        } else {
            this.sortUrl = '&filter[order]=' + column + ' ASC';
        }
        this.getAllClasses();
    }
    /* Filtering, Sorting, Search functions Ends*/

    /* Counting Number of records starts*/
    getQueryDataCount() {
        this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.searchCountQuery;
        this.getDataCount(this.countQuery);

    }
    getDataCount(url) {
        this.classService.getClasseCount(url).subscribe((response) => {
            this.total = response.count;
            this.pages = Math.ceil(this.total / this.perPage);
            this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllClasses();
        },
            error => {
                this.globalErrorHandler.handleError(error);
            }
        );
    }
    getUrl() {
        let currentPos = this.currentPos > -1 ? this.currentPos : 0;
        this.url = '?&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.filterQuery + this.sortUrl; //+ this.searchQuery;
    }
    /* Counting Number of records ends*/
}