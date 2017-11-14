import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { InstitutesService } from '../../../../_services/institute.service';
import { Institutes } from "../../../../_models/Institutes";

@Component({
    selector: "app-institute-list",
    templateUrl: "./institutes-add-edit.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class InstituteAddEditComponent implements OnInit {
    errorMessage: any;
    params: number;
    instituteForm: FormGroup;
    success: number;
    isFormSubmited = false;
    constructor(
        private formBuilder: FormBuilder, private messageService: MessageService,
        private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler,
        private instituteService: InstitutesService,
    ) {
    }

    ngOnInit() {
        this.instituteForm = this.formBuilder.group({
            id: [],
            instituteName: ['', [Validators.required]],
            instituteDescription: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]],
            address: ['', [Validators.required]],
        });

        this.route.params.forEach((params: Params) => {
            this.params = params['instituteId'];
            if (this.params) {
                this.instituteService.getInstituteById(this.params)
                    .subscribe(
                    (results: Institutes) => {
                        console.log(results);
                        this.instituteForm.setValue({
                            id: results.id,
                            instituteName: results.instituteName,
                            instituteDescription: results.instituteDescription,
                            phone: results.phone,
                            email: results.email,
                            address: results.address,
                        });
                    },
                    error => {
                        this.globalErrorHandler.handleError(error);
                    });
            }
        });
    }

    onSubmit(_institute, invalid) {
        this.isFormSubmited=true;
        if (invalid) {
            return false;
        }
        debugger;
        if (this.params) {
            this.instituteService.updateInstitute(_institute._value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/institute/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            // value.createdBy = "1";
            // value.createdOn = "08-11-2017";
            this.instituteService.createInstitute(_institute._value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/institute/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }
    onCancel() {
        this.router.navigate(['/features/institute/list']);
    }

}

