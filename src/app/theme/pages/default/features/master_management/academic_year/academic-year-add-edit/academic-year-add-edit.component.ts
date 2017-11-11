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
        this.academicYearForm = this.formBuilder.group({
            id: [],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            academicYear: [''],
        });

    this.route.params.forEach((params: Params) => {
            this.params = params['id'];
            if (this.params) {
                this.academicYearService.getAcademicYearById(this.params)
                    .subscribe((results: any) => {
                        this.academicYearForm.setValue({
                            id: results.id,
                            startDate: results.startDate,
                            endDate: results.endDate,
                            academicYear: results.academicYear
                        });  
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    })
            }
        });
  }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');

    }
 onSubmit({ value, valid }: { value: any, valid: boolean }) {
        if (this.params) {   
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
            console.log('this.startDate', this.startDate);
            console.log('this.endDate', this.endDate);
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

    setStartDate(date){
        this.academicYearForm.controls['startDate'].setValue(date);
    }
    setEndDate(date){
        this.academicYearForm.controls['endDate'].setValue(date);
    }
 
}
