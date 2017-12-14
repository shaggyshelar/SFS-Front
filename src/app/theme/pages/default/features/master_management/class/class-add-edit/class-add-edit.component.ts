import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { ClassService } from '../../../../_services/class.service';
import { SchoolClass } from "../../../../_models/Class";
import { Helpers } from "../../../../../../../helpers";

@Component({
    selector: "app-institute-list",
    templateUrl: "./class-add-edit.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ClassAddEditComponent implements OnInit {
    errorMessage: any;
    params: number;
    classForm: FormGroup;
    success:number;

    constructor(
        private formBuilder: FormBuilder, private messageService: MessageService,
        private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler,
        private classService: ClassService,
        
    ) {
    }

    ngOnInit() {
        this.classForm = this.formBuilder.group({
            id: [0],
            className: ['', [Validators.required]],
            classCode: ['', [Validators.required]],
        });

        this.route.params.forEach((params: Params) => {
            this.params = params['classId'];
            if (this.params) {
                Helpers.setLoading(true);
                this.classService.getClassById(this.params)
                    .subscribe(
                    (results: SchoolClass) => {
                        Helpers.setLoading(false);
                        this.classForm.setValue({
                            id: results.id,
                            className: results.className,
                            classCode: results.classCode,
                        });
                    },
                    error => {
                        Helpers.setLoading(false);
                        this.globalErrorHandler.handleError(error);
                    });
            }
        });
    }

    onSubmit({ value, valid }: { value: SchoolClass, valid: boolean }) {
        if (this.params) {
            this.classService.updateClass(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/class/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            value.schoolId = parseInt(localStorage.getItem("schoolId"));
            this.classService.createClass(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/class/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }
    onCancel() {
        this.router.navigate(['/features/class/list']);
    }

}

