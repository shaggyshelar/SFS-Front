import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { DivisionService } from '../../../../_services/division.service';
import { Division } from "../../../../_models/Division";
import { ClassService } from '../../../../_services/class.service';
import { Helpers } from "../../../../../../../helpers";

@Component({
    selector: "app-institute-list",
    templateUrl: "./division-add-edit.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class DivisionAddEditComponent implements OnInit {
    errorMessage: any;
    params: number;
    divisionForm: FormGroup;
    success: number;
    classList: SelectItem[];

    constructor(
        private formBuilder: FormBuilder, private messageService: MessageService,
        private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler,
        private divisionService: DivisionService, private classService: ClassService,

    ) {
    }

    ngOnInit() {

        this.classList = [];
        let val = this.classService.getAllClasses();
        //this.classList.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {

            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.classList.push({ label: response[key].className, value: response[key].id });
                }
            }
        }, error => {
            this.globalErrorHandler.handleError(error);
        });
        this.divisionForm = this.formBuilder.group({
            id: [0],
            classId: [, [Validators.required]],
            //schoolId: ['', [Validators.required]],
            divisionName: ['', [Validators.required]],
            divisionCode: ['', [Validators.required]],
        });

        this.route.params.forEach((params: Params) => {
            this.params = params['divisionId'];
            if (this.params) {
                Helpers.setLoading(true);
                this.divisionService.getDivisionById(this.params)
                    .subscribe(
                    (results: Division) => {
                        Helpers.setLoading(false);
                        this.divisionForm.setValue({
                            id: results.id,
                            classId: results.classId,
                            divisionName: results.divisionName,
                            divisionCode: results.divisionCode
                        });
                    },
                    error => {
                        Helpers.setLoading(false);
                        this.globalErrorHandler.handleError(error);
                    });
            }
        });
    }

    onSubmit({ value, valid }: { value: Division, valid: boolean }) {
        if (this.params) {
            this.divisionService.updateDivision(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/division/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            value.schoolId = parseInt(localStorage.getItem("schoolId"));
            this.divisionService.createDivision(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/division/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }
    onCancel() {
        this.router.navigate(['/features/division/list']);
    }

}

