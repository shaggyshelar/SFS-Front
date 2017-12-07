import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { CommonService } from '../../../_services/common.service';
import { ConfigurationService } from '../../../_services/configuration.service';
import { ViewChild } from '@angular/core';
import { Helpers } from "../../../../../../helpers";
import { ConfirmationService } from 'primeng/primeng';

@Component({
    selector: "app-sfsconfiguration-list",
    templateUrl: "./sfsconfiguration-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class SFSConfigurationListComponent implements OnInit {
    configurationList = [];
    schoolId: string;
    constructor(
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private commonService: CommonService,
        private configurationService: ConfigurationService
    ) {
    }

    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!localStorage.getItem("schoolId") || localStorage.getItem("schoolId") == "null" || localStorage.getItem("schoolId") == "0") {
            this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: 'Please Select School' });
        } else {
            this.schoolId = localStorage.getItem("schoolId");
            this.configurationList = this.commonService.getConfigurationKeySFS();
            console.log(this.configurationList)
        }
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
