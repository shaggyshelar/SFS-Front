import { Component, OnInit, ViewEncapsulation, AfterViewInit, NgModule } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { UserSchoolDetailsService } from '../../default/_services/userschooldetails.service';
import { GlobalErrorHandler } from '../../../../_services/error-handler.service';
import { MessageService } from '../../../../_services/message.service';

import * as _ from 'lodash/index';
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./index.component.html",
  encapsulation: ViewEncapsulation.None,

})
export class IndexComponent implements OnInit, AfterViewInit {
  selectedSchoolId: number;
  dashBoardDetails = {
    "dueAmount": 0,
    "paidAmount": 0,
    "toatalStudnetCount": 0
  };
  schoolList = [];
  constructor(private _script: ScriptLoaderService, private messageService: MessageService, private globalErrorHandler: GlobalErrorHandler, private userSchoolDetailsService: UserSchoolDetailsService) {

  }
  ngOnInit() {
    this.selectedSchoolId = 0;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let _superAdmin = _.find(currentUser.roles, { 'name': 'SuperAdmin' });
    Helpers.setLoading(true);
    this.userSchoolDetailsService.getSchoolsByUser(currentUser.userId)
      .subscribe(
      results => {
        Helpers.setLoading(false);

        for (let key in results) {
          if (results[key].UserschoolSchool) {
            this.schoolList.push({ label: results[key].UserschoolSchool.schoolName, value: results[key].UserschoolSchool.id });
          }
        }
        if (!_superAdmin && (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0")) {
          this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
        }
        else if (localStorage.getItem("schoolId") && localStorage.getItem("schoolId") != "null" && localStorage.getItem("schoolId") != "0")
          this.selectedSchoolId = parseInt(localStorage.getItem("schoolId"));
        else
          this.selectedSchoolId = this.schoolList[0].value;
      },
      error => {
        Helpers.setLoading(true);
        this.globalErrorHandler.handleError(error);
      });
  }
  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/app/js/dashboard.js');

  }

  onSchoolChange() {
    this.userSchoolDetailsService.getDashboardDetails(this.selectedSchoolId)
      .subscribe(
      results => {
        Helpers.setLoading(false);

        if (results.length > 0) {
          this.dashBoardDetails.dueAmount = results[0].dueAmount;
          this.dashBoardDetails.paidAmount = results[0].paidAmount;
          this.dashBoardDetails.toatalStudnetCount = results[0].toatalStudnetCount;
        }
      },
      error => {
        Helpers.setLoading(true);
        this.globalErrorHandler.handleError(error);
      });
  }

}
