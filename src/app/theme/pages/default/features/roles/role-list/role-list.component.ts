import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { RoleService } from '../../../_services/role.service';
import { Role } from "../../../_models/role";

@Component({
    selector: "app-role-list",
    templateUrl: "./role-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RoleListComponent implements OnInit {
    roleList: Observable<Role[]>;
    constructor(private router: Router,
        private roleService: RoleService,
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService) {
    }

    ngOnInit() {
        this.getAllRoles();
    }

    getAllRoles() {
        this.roleList = this.roleService.getAllRoles();
    }

    onEditClick(role: Role) {
        this.router.navigate(['/features/roles/edit', role.id]);
    }
    onDelete(role: Role) {
        this.roleService.deleteRole(role.id).subscribe(
            results => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
                this.getAllRoles();
                this.router.navigate(['/features/roles/list']);
            },
            error => {
                this.globalErrorHandler.handleError(error);
            })
    }
}
