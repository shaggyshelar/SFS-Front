  import { Component, OnInit, ViewEncapsulation } from '@angular/core';
  import { FormGroup, Validators, FormBuilder } from '@angular/forms';
  import { Router } from '@angular/router';
  import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
  import { MessageService } from '../../../../../../_services/message.service';
  import { UserSchoolDetailsService } from '../../../../default/_services/userschooldetails.service';
  import { Observable } from 'rxjs/Rx';
  
  @Component({
      selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
      templateUrl: "./schoolDashboard.component.html",
      encapsulation: ViewEncapsulation.None,
  })
  export class SchoolDashboardComponent implements OnInit {
      schoolList: Observable<any>;
      loading = false;
      constructor(
          private formBuilder: FormBuilder,
          private globalErrorHandler: GlobalErrorHandler,
          private router: Router,
          private userSchoolDetailsService: UserSchoolDetailsService,
          private messageService: MessageService) {
      }
  
      ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userSchoolDetailsService.getSchoolsByUser(currentUser.userId)
        .subscribe(
          results => {
            this.schoolList=results;
          },
          error => {
              this.globalErrorHandler.handleError(error);
          });
      }
  
      onSchoolSelect(id,instituteId) {
        localStorage.setItem('schoolId',id);
        localStorage.setItem('instituteId',instituteId);
        this.router.navigate(['/']);
      }
  }