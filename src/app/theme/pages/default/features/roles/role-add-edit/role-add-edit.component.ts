/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { RoleService } from '../../../_services/role.service';
import { Role } from "../../../_models/Role";

/** Component Declaration */
@Component({
    selector: 'app-role-add-edit',
    templateUrl: './role-add-edit.component.html',
})

export class RoleAddEditComponent implements OnInit {
    errorMessage: any;
    params: number;
    permissionList: any;
    filteredPermissionList: any;
    selectedPermission: any;
    rolePermissionList: any;
    roleForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder, private roleService: RoleService,
        private route: ActivatedRoute, private router: Router) {
    }
    ngOnInit() {
        this.roleForm = this.formBuilder.group({
            id: [0],
            RoleName: ['', [Validators.required]],
            RoleDescription: [''],
        });
        this.route.params.forEach((params: Params) => {
            this.params = params['roleId'];
            if (this.params) {
            this.roleService.getRoleById(this.params)
                .subscribe((results:Role) => {
                    this.getAllPermissions();
                    this.getPermissionsByRole();  
                    this.roleForm.setValue({
                        id: results.id,
                        RoleName: results.RoleName,
                        RoleDescription: results.RoleDescription
                    });                  
                })             
            }
        });
    }

    onSubmit({ value, valid }: { value: Role, valid: boolean }) {
        if (this.params) {
            this.roleService.updateRole(value)
                .subscribe(
                results => {
                    this.router.navigate(['/features/roles/list']);
                },
                error => this.errorMessage = <any>error);
        } else {
            this.roleService.createRole(value)
                .subscribe(
                results => {
                    this.router.navigate(['/features/roles/list']);
                },
                error => this.errorMessage = <any>error);
        }
    }

    onAddPermission() {        
    }

    filterPermission(event: any) {
        let query = event.query;
        this.filteredPermissionList = [];
        for (let i = 0; i < this.permissionList.length; i++) {
            let permission = this.permissionList[i];
            if (permission.Text.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                this.filteredPermissionList.push(permission);
            }
        }
    }
    revokePermission(permission:any) {      
    }
    onCancel() {
        this.router.navigate(['/features/roles/list']);
    }
    private getPermissionsByRole() {
        this.rolePermissionList = [
            {
                ID: 1,
                Key: 'DASHBOARD.READ',
                Text: 'Can read Dasboard'
            },
            {
                ID: 2,
                Key: 'PROFILE.MANAGE',
                Text: 'Can manage Profile'
            },
            {
                ID: 3,
                Key: 'Feature.Manage',
                Text: 'Can manage Feature'
            }
        ];
    }
    private getAllPermissions() {  
        this.permissionList = [
            {
                ID: 1,
                Key: 'DASHBOARD.READ',
                Text: 'Can read Dasboard'
            }, {
                ID: 2,
                Key: 'Feature.MANAGE',
                Text: 'Can manage Feature'
            },  
        ]
    }
}

