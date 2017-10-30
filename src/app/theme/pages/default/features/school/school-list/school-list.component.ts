import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';

import { SchoolService } from '../../../_services/school.service';
import { School } from "../../../_models/school";

@Component({
    selector: "app-users-list",
    templateUrl: "./school-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class SchoolListComponent implements OnInit {
    schoolList :  Observable<School[]>;  
    constructor(private router: Router, private schoolService : SchoolService, private globalErrorHandler : GlobalErrorHandler) {
    }

    ngOnInit() {      
        this.getAllSchools();
    }

    getAllSchools() {
        this.schoolList = this.schoolService.getAllSchools();
    }
    onAddSchool() {
        this.router.navigate(['/features/school/add']);
    }

    onEditSchoolClick(school: School) {
        this.router.navigate(['/features/school/edit', school.id]);
    }
    onSchoolDeleteClick(school: School) {
        this.schoolService.deleteSchool(school.id).subscribe(
            data => {
                this.getAllSchools();
            }, error => {
                this.globalErrorHandler.handleError(error);
            });
    }
}
