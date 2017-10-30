import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';

import { RoleService } from '../../../_services/role.service';
import { Role } from "../../../_models/role";

@Component({
  selector: "app-role-list",
  templateUrl: "./role-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class RoleListComponent implements OnInit {
    roleList : Observable<Role[]>;  
    constructor(private router: Router, private roleService: RoleService, private globalErrorHandler : GlobalErrorHandler) {
    }

    ngOnInit() {
        this.getAllRoles();    
    }
   
    getAllRoles(){
        this.roleList = this.roleService.getAllRoles();
    }

    onEditClick(role: Role) {
        this.router.navigate(['/features/roles/edit', role.id]);
    }
    onDelete(role: Role) {
        this.roleService.deleteRole(role.id).subscribe(
        (data) => {                      
            this.getAllRoles();
        }, error =>{
            this.globalErrorHandler.handleError(error);
        })
    }
}
