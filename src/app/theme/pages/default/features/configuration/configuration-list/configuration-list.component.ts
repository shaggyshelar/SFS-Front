import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { CommonService } from '../../../_services/common.service';
import { ConfigurationService } from '../../../_services/configuration.service';
import { UserSchoolDetailsService } from '../../../../default/_services/userschooldetails.service';
import { ViewChild } from '@angular/core';
import { Helpers } from "../../../../../../helpers";
import { ConfirmationService } from 'primeng/primeng';

@Component({
    selector: "app-configuration-list",
    templateUrl: "./configuration-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ConfigurationListComponent implements OnInit {
    schoolList: SelectItem[];
    configurationList = [];
    schoolId: string;
    listDisable: boolean;
    constructor(
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private userSchoolDetailsService: UserSchoolDetailsService,
        private commonService: CommonService,
        private configurationService: ConfigurationService
    ) {
    }

    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
            this.listDisable = false;
        } else {
            this.schoolId = localStorage.getItem("schoolId");
            this.listDisable = true;
            this.configurationList = this.commonService.getConfigurationKey();
            console.log(this.configurationList)
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
    onUpdate(row) {
        this.configurationService.updateConfiguration(row).subscribe(
            data => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });

            }, error => {
                this.globalErrorHandler.handleError(error);
            });
    }

}
