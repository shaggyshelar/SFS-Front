import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CategoriesService } from '../../../../_services/categories.service';
import { Categories } from "../../../../_models/categories";
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { ConfirmationService } from 'primeng/primeng';
import { Helpers } from "../../../../../../../helpers";
@Component({
  selector: "app-users-list",
  templateUrl: "./categories-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesListComponent implements OnInit {
  categoriesList: Observable<Categories[]>;
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
    private categoriesService: CategoriesService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private _script: ScriptLoaderService) {
  }

  ngOnInit() {
    //Page Size Array
    this.pageSize = [];
    this.pageSize.push({ label: '25', value: 25 });
    this.pageSize.push({ label: '50', value: 50 });
    this.pageSize.push({ label: '100', value: 100 });
    this.pageSize.push({ label: '200', value: 200 });



    //Default variable initialization
    this.perPage = this.categoriesService.perPage;
    this.currentPos = this.categoriesService.currentPos;
    this.currentPageNumber = this.categoriesService.currentPageNumber;
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
    //this.getAllCategories();
    if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
      this.router.navigate(['/selectSchool']);
    }
    else {
      this.getDataCount('');
    }
  }

  getAllCategories() {
    Helpers.setLoading(true);
    this.getUrl();
    this.categoriesList = this.categoriesService.getAllCategoriesList(this.url);

    this.categoriesList.subscribe((response) => {
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

  onAddCategory() {
    this.router.navigate(['/features/masterManagement/categories/add']);
  }

  onManageCategoryClick(data: Categories) {
    this.categoriesService.perPage = this.perPage;
    this.categoriesService.currentPos = this.currentPos;
    this.categoriesService.currentPageNumber = this.currentPageNumber;
    this.router.navigate(['/features/masterManagement/categories/edit', data.id]);
  }
  onCategoryDeleteClick(data: Categories) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.categoriesService.deleteCategory(data.id)
          .subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
            if ((this.currentPageNumber - 1) * this.perPage == (this.total - 1)) {
              this.currentPageNumber--;
            }
            this.getQueryDataCount();
          },
          error => {
            this.globalErrorHandler.handleError(error);
          });
      },
      reject: () => {
      }
    });
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
      this.getAllCategories();
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
    this.getAllCategories();
  }

  backPage() {
    if (this.currentPos - this.perPage >= 0) {
      this.currentPos -= this.perPage;
      this.currentPageNumber--;
      this.setDisplayPageNumberRange();
      this.getAllCategories();
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
      this.getAllCategories();
    }
  }

  pageClick(pageNumber) {
    this.currentPos = this.perPage * (pageNumber - 1);
    this.currentPageNumber = pageNumber;
    this.setDisplayPageNumberRange();
    this.getAllCategories();
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
      this.searchQuery = '&filter[where][or][0][categoryName][like]=%' + searchString + "%" + '&filter[where][or][1][categoryCode][like]=%' + searchString + "%";
      this.searchCountQuery = '&[where][or][0][categoryName][like]=%' + searchString + "%" + '&[where][or][1][categoryCode][like]=%' + searchString + "%";
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
    this.getAllCategories();
  }
  /* Filtering, Sorting, Search functions Ends*/

  /* Counting Number of records starts*/
  getQueryDataCount() {
    this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.searchCountQuery;
    this.getDataCount(this.countQuery);

  }
  getDataCount(url) {
    this.categoriesService.getCategoryCount(url).subscribe((response) => {
      this.total = response.count;
      this.pages = Math.ceil(this.total / this.perPage);
      this.generateCount();
      this.setDisplayPageNumberRange();
      this.getAllCategories();
    },
      error => {
        this.globalErrorHandler.handleError(error);
      }
    );
  }
  getUrl() {
    let currentPos = this.currentPos > -1 ? this.currentPos : 0;
    this.url = '?filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.sortUrl + this.searchQuery;
  }
  /* Counting Number of records ends*/
}
