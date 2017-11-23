import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { School } from "../../../_models/school";
import { Merchant } from "../../../_models/merchant";
import { ViewChild } from '@angular/core';
import { Helpers } from "../../../../../../helpers";
import { UserSchoolDetailsService } from '../../../../default/_services/userschooldetails.service';
import { MerchantService } from '../../../../default/_services/merchant.service';
import { ConfirmationService } from 'primeng/primeng';

@Component({
    selector: "app-merchant-list",
    templateUrl: "./merchant-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class MerchantListComponent implements OnInit {
    schoolList: SelectItem[];
    listDisable: boolean;
    schoolId: string;
    merchantList: Observable<Merchant[]>;
    constructor(
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService,
        private userSchoolDetailsService: UserSchoolDetailsService,
        private merchantServics: MerchantService,
        private confirmationService: ConfirmationService,
    ) {
    }

    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //let schoolId = JSON.parse(localStorage.getItem('schoolId'));
        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
            this.listDisable = false;
        } else {
            this.schoolId = localStorage.getItem("schoolId");
            this.listDisable = true;
            this.getAllMerchants();
        }
        this.userSchoolDetailsService.getSchoolsByUser(currentUser.userId)
            .subscribe(
            response => {
                this.schoolList = [];
                for (let key in response) {
                    if (response.hasOwnProperty(key)) {
                        this.schoolList.push({ label: response[key].UserschoolSchool.schoolName, value: response[key].schoolId });
                    }
                }
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    getAllMerchants() {
        this.merchantServics.getAllMerchants(this.schoolId)
            .subscribe(response => {
                this.merchantList = response;
            });
    }

    onEditMerchant(row) {
        this.merchantServics.updateMerchant(row).subscribe(
            data => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
                this.getAllMerchants();
            }, error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    onDeleteMerchant(id) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.merchantServics.deleteMerchant(id).subscribe(
                    data => {
                        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    });
            },
            reject: () => {
            }
        });
        // this.merchantServics.deleteMerchant(id)
        // .subscribe(response => {

        // });
        this.getAllMerchants();
    }

    onSchoolSelect(id) {
        this.schoolId = id;
        this.listDisable = true;
        this.getAllMerchants();
        // if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
        //     this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
        //     this.listDisable = false;
        // } else {
        //     this.schoolId = localStorage.getItem("schoolId");
        //     this.listDisable = true;
        // }
    }
}
