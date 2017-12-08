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
    selector: "app-student-report-list",
    templateUrl: "./student-report.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class MerchantListComponent implements OnInit {
    schoolList: SelectItem[];
    listDisable: boolean;
    schoolId: string;
    merchantList: Merchant[];
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
        }     
    }

}
