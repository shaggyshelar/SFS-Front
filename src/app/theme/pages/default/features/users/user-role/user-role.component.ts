/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as _ from 'lodash/index';

import { RoleService, UserRoleService } from '../../../_services/index';
import { Role } from "../../../_models/role";

/** Component Declaration */
@Component({
    selector: 'app-user-role',
    templateUrl: './user-role.component.html',
})

export class UserRoleComponent implements OnInit {
    params: number;
    userRole: any;
    userName: string = '';
    roleList: any;
    roleDropdown: any;
    selectedRole: any = null;

    constructor(
        private route: ActivatedRoute,
        private roleService: RoleService,
        private userRoleService: UserRoleService,
        private router: Router) { }

    ngOnInit() {
        this.userRole = [];
        this.route.params.forEach((params: Params) => {
            this.params = Number(params['id']);
            this.getAllRoles();
        });
    }

    getAllRoles() {
        this.roleService.getAllRoles()
            .subscribe(
            results => {
                this.roleDropdown = <any>results;
                this.getUserRole();
            });
    }

    getUserRole() {
        this.userRoleService.getUserRole(this.params)
            .subscribe(
            (results: any) => {
                //this.userName = results.UserName;
                this.userName = results.username;
                this.userRole = results.roles;
                if( this.userRole.length > 0){
                     this.selectedRole = _.find(this.roleDropdown,{id :this.userRole[0].id });
                }
               // this.setRoleDropdown();
            });
    }

    onAssignRole() {
        if (this.selectedRole !== '' && this.selectedRole !== null) {
            let params  =  {
                principalType: "USER",
                principalId: this.params,
                roleId: this.selectedRole.id
            }
            this.userRoleService.addUserRole(params)
                .subscribe(
                results => {
                    this.selectedRole = null;
                    this.getUserRole();
                });
        }
    }

    onRevokeRole(role: any) {
        // role.userId = this.params;
        // this.userRoleService.revokeUserRole(role)
        //     .subscribe(
        //     results => {
        //         this.getUserRole();
        //     });
    }

    private setRoleDropdown() {
        var flag = false;
        this.roleDropdown = [];
        for (var i = 0; i < this.roleList.length; i++) {
            for (var j = 0; j < this.userRole.length; j++) {
                if (this.roleList[i].name === this.userRole[j].name) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this.roleDropdown.push(this.roleList[i]);
            }
            flag = false;
        }
    }
}

