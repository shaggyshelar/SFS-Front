import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import * as _ from 'lodash/index';
import { InvoiceService } from '../../../_services/index';
import { GlobalErrorHandler } from './../../../../../../_services/error-handler.service';
import { MessageService } from './../../../../../../_services/message.service';
import { AcademicYearService } from './../../../_services/index';
import { Boards } from "./../../../_models/Boards";

@Component({
    selector: "app-invoice-summary",
    templateUrl: "./invoice-summary.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class InvoiceSummaryComponent implements OnInit {
    params: number;
    academicYearForm: FormGroup;
    invoice :any;
    statusChanged=false;
    startDate: any;
    endDate: any;
    startAcademicYear: any;
    endAcademicYear: any;
    minEndDate: any;
    isEndYearSameAsStarYear: boolean = false
    isCurrentYearDisabled: boolean = false

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _script: ScriptLoaderService,
        private invoiceService: InvoiceService,
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService) {
    }
    ngOnInit() {
        this.invoice={};        
        this.startAcademicYear = '';
        this.endAcademicYear = '';
        this.minEndDate = new Date();
        this.route.params.forEach((params: Params) => {
            this.params = params['invoiceId'];
            if (this.params) {
                this.getInvoiceSumary();
            }
        });

    }
    getInvoiceSumary() {
        let url = '?filter[include]=studentData&filter[include]=invoiceDetails';
        this.invoiceService.getInvoiceSumary(this.params, url).subscribe(
            response => {
                this.invoice = response.invoices;
               // this.invoice.invoiceStatus="Paid";
                this.invoice.dueDate = new Date(response.invoices.dueDate);
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }
    updateInvoice() {
        if (!this.invoice.dueDate) {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please select due date' });
            return false;
        }
        else if (!this.invoice.invoiceStatus) {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please select invoice status' });
            return false;
        }
        else if(this.statusChanged && this.invoice.status=='Paid' && this.invoice.statusDesc=='' ){
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please enter invoice description' });
            return false;
        }
        this.invoiceService.updateInvoice(this.invoice).subscribe(
            response => {
                this.invoice = response;
                this.router.navigate(['/features/invoice/list']);
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }
    onStatusChange()
    {
        this.statusChanged=true;
    }
    cancelInvoice() {
        this.router.navigate(['/features/invoice/list']);
    }
}