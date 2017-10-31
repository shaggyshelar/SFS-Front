import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./institutes.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class InstitutesComponent implements OnInit {
    constructor(private router: Router,
        private messageService: MessageService,
        private globalErrorHandler: GlobalErrorHandler,
        private _script: ScriptLoaderService) {
    }

    ngOnInit() {
        //this.getAllSchools();
    }

    // ngAfterViewInit() {
    //     this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    //         'assets/demo/default/custom/components/datatables/base/school-html-table.js');
    // }

    // getAllSchools() {
    //     this.schoolList = this.schoolService.getAllSchools();
    // }
    // onAddSchool() {
    //     this.router.navigate(['/features/school/add']);
    // }

    // onEditSchoolClick(school: School) {
    //     this.router.navigate(['/features/school/edit', school.id]);
    // }
    // onSchoolDeleteClick(school: School) {
    //     this.schoolService.deleteSchool(school.id).subscribe(
    //         results => {
    //             this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
    //             this.getAllSchools();
    //         },
    //         error => {
    //             this.globalErrorHandler.handleError(error);
    //         });
    // }
}