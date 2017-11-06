import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { SchoolService } from '../../../_services/school.service';
import { School } from "../../../_models/school";

import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./school-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class SchoolListComponent implements OnInit {
    schoolList: Observable<School[]>;
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
    ascSortCol2: boolean;  //Sorting for Column1
    filterCol1: any;       //Filter1 values 
    filterCol2: any;       //Filter2 values 
    filterQuery: string;   //Filter1 Api Query 
    filterQuery2: string;  //Filter2 Api Query 
    searchQuery: string;   //Search Api Query 
    countQuery: string;    //Count number of records query
    filter1CountQuery: string;  //Count number of records for filter1CountQuery
    filter2CountQuery: string;  //Count number of records for filter2CountQuery
    longList: boolean;     //To show now records found message
    prePageEnable :boolean; //To disable/enable prev page button
    nextPageEnable :boolean; //To disable/enable prev page button

    constructor(private router: Router,
        private schoolService: SchoolService,
        private messageService: MessageService,
        private globalErrorHandler: GlobalErrorHandler,
        private _script: ScriptLoaderService) {
    }

    ngOnInit() {

        //Page Size Array
        this.pageSize = [];
        this.pageSize.push({ label: '5', value: 5 });
        this.pageSize.push({ label: '10', value: 10 });
        this.pageSize.push({ label: '20', value: 20 });
        this.pageSize.push({ label: '30', value: 30 });
        this.pageSize.push({ label: '50', value: 50 });
        this.pageSize.push({ label: '100', value: 100 });

        this.filterCol1 = [];
        this.filterCol1.push({ label: '--Select--', value: 'select' });
        this.filterCol1.push({ label: 'BTPS', value: 'BTPS' });
        this.filterCol1.push({ label: 'Don Bosco', value: 'Don Bosco' });

        this.filterCol2 = [];
        let val = this.schoolService.getFilterList("?filter[fields][InstituteId]=true&filter[fields][id]=true");
        this.filterCol2.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {
            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.filterCol2.push({ label: response[key].InstituteId, value: response[key].InstituteId });
                }
            }
        });

        //Default variable initialization
        this.perPage = 5;
        this.currentPos = 0;
        this.url = '';
        this.sortUrl = '&filter[order]=id ASC';
        this.ascSortCol1 = true;
        this.ascSortCol2 = true;
        this.filterQuery = '';
        this.filterQuery2 = '';
        this.searchQuery = '';
        this.countQuery = '?';
        this.filter1CountQuery = '';
        this.filter2CountQuery = '';
        this.lastPage = this.perPage;
        this.currentPageNumber = 1;
        this.firstPageNumber = 1;
        this.prePageEnable = false;
        this.nextPageEnable = true;

        this.getDataCount('');
    }

    /*Pagination Function's Starts*/

    currentPageCheck(pageNumber){
        if(this.currentPageNumber == pageNumber)
            return false;
        else 
            return true;
    }
    generateCount() {
        this.arr = [];
        for (var index = 0; index < this.pages; index++) {
            this.arr[index] = index + 1;
        }
    }

    pageSizeChanged(size) {
        this.perPage = size;
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.getQueryDataCount();
    }

    backPage() {
        if (this.currentPos - this.perPage >= 0) {
            this.currentPos -= this.perPage;
            this.currentPageNumber--;
            this.setDisplayPageNumberRange();
            this.getAllSchools();
        }
        else{
            this.currentPos = 0;
            this.currentPageNumber = 1;
        }
    }
    nextPage() {
        if (this.currentPos + this.perPage < this.total) {
            this.currentPos += this.perPage;
            this.currentPageNumber++;
            this.setDisplayPageNumberRange();
            this.getAllSchools();
        }
    }

    pageClick(pageNumber) {
        this.currentPos = this.perPage * (pageNumber - 1);
        this.currentPageNumber = pageNumber;
        this.setDisplayPageNumberRange();
        this.getAllSchools();
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
        } else {
            this.searchQuery = '&filter[where][SchoolName][ilike]=' + searchString;
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
        this.getQueryDataCount();
    }

    sort(column, sortOrder) {
        if (sortOrder) {
            this.sortUrl = '&filter[order]=' + column + ' DESC';
        } else {
            this.sortUrl = '&filter[order]=' + column + ' ASC';
        }
        this.getAllSchools();
    }
    /* Filtering, Sorting, Search functions Ends*/

    /* Counting Number of records starts*/
    getQueryDataCount() {
        this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery;
        this.getDataCount(this.countQuery);

    }
    getDataCount(url) {
        this.schoolService.getSchoolCount(url).subscribe((response) => {
            this.total = response.count;
            this.pages = Math.ceil(this.total / this.perPage);
            this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllSchools();

        },
        );
    }
    getUrl() {
        this.url = '?filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.filterQuery + this.filterQuery2 + this.sortUrl + this.searchQuery;

    }
    /* Counting Number of records ends*/

    /*CRUD Operations Starts */

    getAllSchools() {
        this.getUrl();
        this.schoolList = this.schoolService.getAllSchools(this.url);
        this.schoolList.subscribe((response) => {
            this.longList = response.length > 0 ? true : false;
        });
    }

    onAddSchool() {
        this.router.navigate(['/features/school/add']);
    }

    onEditSchoolClick(school: School) {
        this.router.navigate(['/features/school/edit', school.id]);
    }
    onSchoolDeleteClick(school: School) {
        this.schoolService.deleteSchool(school.id).subscribe(
            results => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
                if((this.currentPageNumber-1)*this.perPage == (this.total-1)){
                    this.currentPageNumber --;
                }
                this.getQueryDataCount();
                
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    /*CRUD Operations Ends */
}