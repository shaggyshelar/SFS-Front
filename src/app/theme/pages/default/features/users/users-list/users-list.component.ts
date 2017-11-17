import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ConfirmationService } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { SchoolService } from '../../../_services/school.service';
import { UserService } from '../../../_services/user.service';
import { User } from "../../../_models/user";
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import * as _ from 'lodash/index';
@Component({
    selector: "app-users-list",
    templateUrl: "./users-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit {
    userList: Observable<User[]>;
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
    selectedPageSize: number; //HTML values
    userRole: string;
    constructor(private userService: UserService,
        private router: Router,
        private schoolService: SchoolService,
        private globalErrorHandler: GlobalErrorHandler,
        private confirmationService: ConfirmationService,
        private messageService: MessageService) {
    }

    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userRole = currentUser.roles && currentUser.roles.length > 0 ? currentUser.roles[0].name : '';
        //Page Size Array
        this.pageSize = [];
        this.pageSize.push({ label: '5', value: 5 });
        this.pageSize.push({ label: '10', value: 10 });
        this.pageSize.push({ label: '20', value: 20 });
        this.pageSize.push({ label: '30', value: 30 });
        this.pageSize.push({ label: '50', value: 50 });
        this.pageSize.push({ label: '100', value: 100 });



        //Default variable initialization
        this.perPage = 5;
        this.currentPos = 0;
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
        this.currentPageNumber = 1;
        this.firstPageNumber = 1;
        this.prePageEnable = false;
        this.nextPageEnable = true;
        this.boundry = 3;
        this.boundryStart = 1;
        this.boundryEnd = this.boundry;

        this.getAllUsers();
        this.getDataCount('');
    }

    getAllUsers() {
        this.getUrl();
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let _superAdmin = _.find(currentUser.roles, { 'name': 'SuperAdmin' });
        if (!_superAdmin) {
            this.userList = this.schoolService.getUsersBySchoolId(this.url);
        }
        else {
            this.url = this.url + "&filter[where][roleId]=2";
            this.userList = this.userService.getUsersForSuperuser(this.url);
        }
        this.userList.subscribe((response) => {
            this.longList = response.length > 0 ? true : false;
        }, error => {
            this.globalErrorHandler.handleError(error);
        });
    }
    onManageRoleClick(user: User) {
        this.router.navigate(['/features/users/manage-role', user.id]);
    }
    onEditClick(user: User) {
        this.router.navigate(['/features/users/edit', user.id]);
    }
    onDelete(user: User) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.userService.deleteUser(user.id).subscribe(
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
    onAddClick() {
        this.router.navigate(['/features/users/add']);
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

    visitFirsPage() {
        if (this.boundryStart > this.boundry) {
            this.currentPos = 0;
            this.currentPageNumber = 1;
            this.boundryStart = 1;
            this.boundryEnd = this.boundry;
            this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllUsers();
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
        this.getAllUsers();
    }

    backPage() {
        if (this.currentPos - this.perPage >= 0) {
            this.currentPos -= this.perPage;
            this.currentPageNumber--;

            // this.boundryStart--;
            // this.boundryEnd--;
            // this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllUsers();
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
            this.getAllUsers();
        }
    }

    pageClick(pageNumber) {
        this.currentPos = this.perPage * (pageNumber - 1);
        this.currentPageNumber = pageNumber;
        this.setDisplayPageNumberRange();
        this.getAllUsers();
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

    searchString(searchString) {
        if (searchString == '') {
            this.searchQuery = '';
            this.searchCountQuery = '';
        } else {
            this.searchQuery = '&filter[where][username][like]=%' + searchString + '%';
            this.searchCountQuery = '&[where][username][like]=%' + searchString + '%';
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
        this.getQueryDataCount();
        //this.getAllUsers();
    }

    /* Counting Number of records starts*/
    getQueryDataCount() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let _superAdmin = _.find(currentUser.roles, { 'name': 'SuperAdmin' });
        if (_superAdmin) {
            this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.searchCountQuery;
        } else {
            this.countQuery = this.filter1CountQuery + this.filter2CountQuery + this.searchCountQuery;
        }
        this.getDataCount(this.countQuery);
    }
    getDataCount(url) {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let _superAdmin = _.find(currentUser.roles, { 'name': 'SuperAdmin' });
        if (!_superAdmin) {
            this.schoolService.getUsersCountBySchoolId(url).subscribe((response) => {
                this.total = response.count;
                this.pages = Math.ceil(this.total / this.perPage);
                this.generateCount();
                this.setDisplayPageNumberRange();
                this.getAllUsers();
            },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
        else {
            url = "?where[roleId]=2" + url;
            this.userService.getUsersCountForSuperuser(url).subscribe((response) => {
                this.total = response.count;
                this.pages = Math.ceil(this.total / this.perPage);
                this.generateCount();
                this.setDisplayPageNumberRange();
                this.getAllUsers();
            },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }

    getUrl() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let _superAdmin = _.find(currentUser.roles, { 'name': 'SuperAdmin' });
        if (_superAdmin) {
            this.url = '?filter[include]=role&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.sortUrl + this.searchQuery;
        } else {
            this.url = 'filter[include]=role&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.sortUrl + this.searchQuery;
        }
    }

    toggleUserStatus(item, status) {
        item.isActivate = status;
        this.userService.updateUserStatus(item)
            .subscribe(
            results => {
                if (status)
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'User Activated Successfully' });
                else
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'User Deactivated Successfully' });

                this.getAllUsers();
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    unblockuser(model) {
        let email = {
            email: model.email
        };
        this.userService.forgotPassword(email)
            .subscribe(
            data => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Reset Password Link Sent To User Successfully.' });
                this.getAllUsers();
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    sort(column, sortOrder) {
        if (sortOrder) {
            this.sortUrl = '&filter[order]=' + column + ' DESC';
        } else {
            this.sortUrl = '&filter[order]=' + column + ' ASC';
        }
        this.getAllUsers();
    }
}
