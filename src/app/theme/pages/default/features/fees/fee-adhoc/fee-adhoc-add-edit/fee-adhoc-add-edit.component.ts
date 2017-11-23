import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';

import { AdhocFeeService } from '../../../../_services/index';
import { AdhocFee } from "../../../../_models/index";

@Component({
  selector: "app-fee-adhoc-add-edit",
  templateUrl: "./fee-adhoc-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class AdhocFeeAddEditComponent implements OnInit {
 params: number;
 adhocFeeForm: FormGroup;
 minDueDate : any;

     constructor(
        private formBuilder: FormBuilder,
        private adhocFeeService: AdhocFeeService,
        private route: ActivatedRoute,
        private router: Router,
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService) {
    }
  ngOnInit() {
      this.minDueDate = new Date();
        this.adhocFeeForm = this.formBuilder.group({
            id: [],
            adhocfeeName: ['', [Validators.required]],
            adhocfeeDescription: ['', [Validators.required]],
            dueDate:['', [Validators.required]]
        });

    this.route.params.forEach((params: Params) => {
            this.params = params['id'];
            if (this.params) {
                this.adhocFeeService.getAdhocFeeById(this.params)
                    .subscribe((results: any) => {
                        this.adhocFeeForm.setValue({
                            id: results.id,
                            adhocfeeName: results.adhocfeeName,
                            adhocfeeDescription: results.adhocfeeDescription,
                            dueDate:new Date(results.dueDate)
                        });  
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    })
            }
        });
  }

 onSubmit({ value, valid }: { value: any, valid: boolean }) {
        value.schoolId = localStorage.getItem('schoolId');
        value.dueDate = value.dueDate.getFullYear() + '-' + (value.dueDate.getMonth() + 1) + '-' + value.dueDate.getDate();
        if (this.params) {   
            this.adhocFeeService.updateAdhocFee(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/adhocFee/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            this.adhocFeeService.createAdhocFee(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/adhocFee/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }

    onCancel() {
       this.router.navigate(['/features/adhocFee/list']);
    }
 
}
