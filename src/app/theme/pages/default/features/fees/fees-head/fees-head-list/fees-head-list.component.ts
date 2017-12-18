import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ConfirmationService } from 'primeng/primeng';
import { FeesService } from '../../../../_services/fees.service';
import { Fees } from "../../../../_models/fees";
import { Pipe, PipeTransform } from '@angular/core';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { SelectItem } from 'primeng/primeng';
import { FrequencyService } from '../../../../_services/frequency.service';


@Component({
  selector: "app-users-list",
  templateUrl: "./fees-head-list.component.html",
  encapsulation: ViewEncapsulation.None,
})



export class FeesHeadListComponent implements OnInit {
  feesList: Observable<Fees[]>;
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
  filterQuery: string;   //Filter1 Api Query 
  searchQuery: string;   //Search Api Query 
  countQuery: string;    //Count number of records query
  filter1CountQuery: string;  //Count number of records for filter1CountQuery
  searchCountQuery: string;
  longList: boolean;     //To show now records found message
  prePageEnable: boolean; //To disable/enable prev page button
  nextPageEnable: boolean; //To disable/enable prev page button
  boundry: number;
  boundryStart: number;
  boundryEnd: number;
  filterValue1: string; //HTML values
  searchValue: string; //HTML values
  selectedPageSize: number = 25; //HTML values

  frequencyIdList: SelectItem[];

  constructor(private router: Router, private feesService: FeesService, private globalErrorHandler: GlobalErrorHandler, private messageService: MessageService, private frequencyService: FrequencyService, private confirmationService: ConfirmationService) {
  }
  ngOnInit() {

    this.pageSize = [];
    this.pageSize.push({ label: '25', value: 25 });
    this.pageSize.push({ label: '50', value: 50 });
    this.pageSize.push({ label: '100', value: 100 });
    this.pageSize.push({ label: '200', value: 200 });

    let val = this.frequencyService.getAllFrequency();
    this.frequencyIdList = [];
    this.frequencyIdList.push({ label: '--Select--', value: 'select' });
    val.subscribe((response) => {
      for (let key in response) {
        if (response.hasOwnProperty(key)) {
          this.frequencyIdList.push({ label: response[key].frequencyName, value: response[key].id });
        }
      }
    });

    //Default variable initialization
    this.perPage = this.feesService.perPage;
    this.currentPos = this.feesService.currentPos;
    this.currentPageNumber = this.feesService.currentPageNumber;
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
    this.searchQuery = '';
    this.countQuery = '?';
    this.filter1CountQuery = '';
    this.lastPage = this.perPage;
    this.firstPageNumber = 1;
    this.prePageEnable = false;
    this.nextPageEnable = true;
    this.boundry = 3;
    this.boundryStart = 1;
    this.boundryEnd = this.boundry;
    this.searchCountQuery = '';
    this.longList = true;
    this.getDataCount('');
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
    if (this.pages < this.boundry) {
      this.boundry = this.pages;
      this.boundryEnd = this.pages;
    } else {
      this.boundry = 3;
    }

    for (var index = 0, j = this.boundryStart; j <= this.boundryEnd; index++ , j++) {
      this.arr[index] = j;
    }
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
      this.getAllFees();
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
    this.generateCount();
    this.setDisplayPageNumberRange();
    this.getAllFees();
  }

  backPage() {
    if (this.currentPos - this.perPage >= 0) {
      this.currentPos -= this.perPage;
      this.currentPageNumber--;
      this.setDisplayPageNumberRange();
      this.getAllFees();
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
      this.setDisplayPageNumberRange();
      this.getAllFees();
    }
  }

  pageClick(pageNumber) {
    this.currentPos = this.perPage * (pageNumber - 1);
    this.currentPageNumber = pageNumber;
    this.setDisplayPageNumberRange();
    this.getAllFees();
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
      this.searchQuery = '&filter[where][feeHeadName][like]=%' + searchString + "%";
      this.searchCountQuery = '&[where][feeHeadName][like]=%' + searchString + "%";
    }
    this.currentPos = 0;
    this.currentPageNumber = 1;
    this.boundryStart = 1;
    this.boundry = 3;
    this.boundryEnd = this.boundry;
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

  sort(column, sortOrder) {
    if (sortOrder) {
      this.sortUrl = '&filter[order]=' + column + ' DESC';
    } else {
      this.sortUrl = '&filter[order]=' + column + ' ASC';
    }
    this.getAllFees();
  }
  /* Filtering, Sorting, Search functions Ends*/

  /* Counting Number of records starts*/
  getQueryDataCount() {
    this.countQuery = '?' + this.filter1CountQuery + this.searchCountQuery;
    this.getDataCount(this.countQuery);

  }
  getDataCount(url) {
    if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
      this.getAllFees();
    } else {
      this.feesService.getFeesCount(url).subscribe((response) => {
        this.total = response.count;
        this.pages = Math.ceil(this.total / this.perPage);
        this.generateCount();
        this.setDisplayPageNumberRange();
        this.getAllFees();
      },
        error => {
          this.globalErrorHandler.handleError(error);
          //Helpers.setLoading(false);
        }
      );
    }
  }
  getUrl() {
    if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
      let currentPos = this.currentPos > -1 ? this.currentPos : 0;
      this.url = '?&filter[where][schoolId]=0&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.filterQuery + this.sortUrl + this.searchQuery;
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
    } else {
      let currentPos = this.currentPos > -1 ? this.currentPos : 0;
      this.url = '?&filter[where][schoolId]=' + localStorage.getItem("schoolId") + '&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.filterQuery + this.sortUrl + this.searchQuery;
    }
  }
  /* Counting Number of records ends*/

  getAllFees() {
    //this.feesList = this.feesService.getAllFees();
    this.getUrl();
    //Helpers.setLoading(true);
    this.feesList = this.feesService.getAllFeesList(this.url);
    this.feesList.subscribe((response) => {
      this.longList = response.length > 0 ? true : false;
      if (!this.longList) {
        this.firstPageNumber = 0;
      }
    },
      error => {
        this.globalErrorHandler.handleError(error);
        // Helpers.setLoading(false);
      }
    );
    //Helpers.setLoading(false);
  }
  onManageFeeClick(data: Fees) {
    this.feesService.perPage = this.perPage;
    this.feesService.currentPos = this.currentPos;
    this.feesService.currentPageNumber = this.currentPageNumber;
    this.router.navigate(['/features/fees/feesHead/edit', data.id]);
  }

  onFeeDeleteClick(data: Fees) {
    // this.feesService.deleteFee(data.id).subscribe(
    //   results => {
    //     this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
    //     this.getAllFees();
    //   },
    //   error => {
    //     this.globalErrorHandler.handleError(error);
    //   });

    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.feesService.deleteFee(data.id).subscribe(
          data => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
            if ((this.currentPageNumber - 1) * this.perPage == (this.total - 1)) {
              this.currentPageNumber--;
            }
            this.getQueryDataCount();
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      },
      reject: () => {
      }
    });

  }

  onAddFees() {
    this.router.navigate(['/features/fees/feesHead/add']);
  }
}
