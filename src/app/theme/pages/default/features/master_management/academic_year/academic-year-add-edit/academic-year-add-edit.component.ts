import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';

import { AcademicYearService } from '../../../../_services/index';
import { Boards } from "../../../../_models/Boards";

@Component({
    selector: "app-academic-year-add-edit",
    templateUrl: "./academic-year-add-edit.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class AcademicYearAddEditComponent implements OnInit {
    params: number;
    academicYearForm: FormGroup;
    startDate: any;
    endDate: any;
    startAcademicYear: any;
    endAcademicYear: any;
    minStartDate: any;

    constructor(
        private formBuilder: FormBuilder,
        private academicYearService: AcademicYearService,
        private route: ActivatedRoute,
        private router: Router,
        private _script: ScriptLoaderService,
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService) {
    }
    ngOnInit() {
        this.startAcademicYear = '';
        this.endAcademicYear = '';
        this.minStartDate = new Date();
        this.academicYearForm = this.formBuilder.group({
            id: [],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
        });

        this.route.params.forEach((params: Params) => {
            this.params = params['id'];
            if (this.params) {
                this.academicYearService.getAcademicYearById(this.params)
                    .subscribe((results: any) => {
                        this.academicYearForm.setValue({
                            id: results.id,
                            startDate: new Date(results.startDate),
                            endDate: new Date(results.endDate),
                        });
                        if (results.academicYear) {
                            let academicYear = results.academicYear.split("-");
                            this.startAcademicYear = academicYear[0];
                            this.endAcademicYear = academicYear[1] ? academicYear[1] : '';
                        }
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    })
            }
        });
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        if (this.params) {
            value.schoolId = localStorage.getItem('schoolId');
            value.startDate = value.startDate.getFullYear() + '-' + (value.startDate.getMonth() + 1) + '-' + value.startDate.getDate();
            value.endDate = value.endDate.getFullYear() + '-' + (value.endDate.getMonth() + 1) + '-' + value.endDate.getDate();
            if (this.endAcademicYear != '') {
                value.academicYear = this.startAcademicYear + ' - ' + this.endAcademicYear;
            } else {
                value.academicYear = this.startAcademicYear;
            }
            this.academicYearService.updateAcademicYear(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/academicYear/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            value.schoolId = localStorage.getItem('schoolId');
            value.startDate = value.startDate.getFullYear() + '-' + (value.startDate.getMonth() + 1) + '-' + value.startDate.getDate();
            value.endDate = value.endDate.getFullYear() + '-' + (value.endDate.getMonth() + 1) + '-' + value.endDate.getDate();
            if (this.endAcademicYear != '') {
                value.academicYear = this.startAcademicYear + ' - ' + this.endAcademicYear;
            } else {
                value.academicYear = this.startAcademicYear;
            }
            this.academicYearService.createAcademicYear(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/academicYear/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }

    onCancel() {
        this.router.navigate(['/features/academicYear/list']);
    }

    setStartDate(value) {
        if (value) {
            let cloneDate = _.clone(value);
            this.startAcademicYear = value.getFullYear();
            let updatedDate = cloneDate.setMonth(cloneDate.getMonth() + 12)
            let endDate = new Date(updatedDate);
            this.academicYearForm.controls['endDate'].setValue(endDate);
            if (this.startAcademicYear != endDate.getFullYear())
                this.endAcademicYear = endDate.getFullYear().toString().substring(2, 4);
        }
    }
    setEndDate(value) {
        if (value) {
            let endDate = value.getFullYear();
            if (this.startAcademicYear != endDate)
                this.endAcademicYear = endDate.toString().substring(2, 4);
        }
    }
}
