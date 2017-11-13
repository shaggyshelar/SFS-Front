import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { FrequencyService } from '../../../../_services/frequency.service';
import { Frequencies } from "../../../../_models/frequencies";

@Component({
    selector: "app-frequency-list",
    templateUrl: "./frequency-add-edit.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class FrequenciesAddEditComponent implements OnInit {
    errorMessage: any;
    params: number;
    frequencyForm: FormGroup;
    success: number;
    isFormSubmited = false;
    constructor(
        private formBuilder: FormBuilder, private messageService: MessageService,
        private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler,
        private frequencyService: FrequencyService,
    ) {
    }

    ngOnInit() {
        this.frequencyForm = this.formBuilder.group({
            id: [],
            frequencyName: ['', [Validators.required]],
            frequencyValue: ['', [Validators.required]],
        });

        this.route.params.forEach((params: Params) => {
            this.params = params['frequencyId'];
            if (this.params) {
                this.frequencyService.getFrequencyById(this.params)
                    .subscribe(
                    (results: Frequencies) => {
                        console.log(results);
                        this.frequencyForm.setValue({
                            id: results.id,
                            frequencyName: results.frequencyName,
                            frequencyValue: results.frequencyValue,
                        });
                    },
                    error => {
                        this.globalErrorHandler.handleError(error);
                    });
            }
        });
    }

    onSubmit({ value, invalid }: { value: Frequencies, invalid: boolean }) {
        this.isFormSubmited=true;
        if (invalid) {
            return false;
        }
        if (this.params) {
            this.frequencyService.updateFrequency(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/masterManagement/frequencies/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            // value.createdBy = "1";
            // value.createdOn = "08-11-2017";
            this.frequencyService.createFrequency(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/masterManagement/frequencies/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }
    onCancel() {
        this.router.navigate(['/features/masterManagement/frequencies/list']);
    }

}

