/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { RoleService, FeatureService, PermissionService } from '../../../_services/index';
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
    roleName: string;
    featureList: any;

    constructor(
        private formBuilder: FormBuilder,
        private roleService: RoleService,
        private featureService: FeatureService,
        private permissionService: PermissionService,
        private route: ActivatedRoute,
        private router: Router,
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService) {
    }
    ngOnInit() {
        this.filteredPermissionList = [];
        this.permissionList = [];
        this.featureList = [];
        this.roleForm = this.formBuilder.group({
            id: [],
            displayName: ['', [Validators.required]],
            name: [''],
            description: [''],
        });
        this.route.params.forEach((params: Params) => {
            this.params = params['roleId'];
            if (this.params) {
                this.roleService.getRoleById(this.params)
                    .subscribe((results: any) => {
                        this.getAllFeatures();
                        // this.getPermissionsByRole();
                        this.roleName = results.name;
                        this.roleForm.setValue({
                            id: results.id,
                            displayName: results.displayName,
                            name: results.name,
                            description: results.description
                        });
                        this.rolePermissionList = results.permissions ? results.permissions : [];
                        this.updatePermissionList(this.rolePermissionList);
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    })
            }
        });
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      var schoolId = JSON.parse(localStorage.getItem('schoolId'));
        if (this.params) {           
            this.roleService.updateRole(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/roles/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            value.name = value.displayName;
            value.schoolId = schoolId;
            value.createdBy = currentUser.user.username;
            value.created = new Date();
            this.roleService.createRole(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/roles/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }

    onAddPermission() {
        let params = {
            permission: this.selectedPermission.permissionName,
            principalName: this.roleName,
            principalId: this.params
        }
        this.permissionService.addPermissionToRole(params)
            .subscribe(
            results => {
                this.getPermissionsByRole();
                this.selectedPermission = null;
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Permission Added' });
            });
    }

    revokePermission(permission: any) {
        this.permissionService.revokePermission(permission.id).subscribe(
            results => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'permission Deleted Successfully' });
                this.getPermissionsByRole();
            },
            error => {
                this.globalErrorHandler.handleError(error);
            })
    }
    onCancel() {
        this.router.navigate(['/features/roles/list']);
    }
    private getPermissionsByRole() {
        this.permissionService.getPermissionsByRole(this.params).subscribe(
            results => {
                this.rolePermissionList = results.permissions ? results.permissions : [];
                this.updatePermissionList(this.rolePermissionList);
                this.featureList = this.getFilteredFeatureList();
                this.getfilteredPermissions(null);
            },
            error => {
                this.globalErrorHandler.handleError(error);
            })
    }

    private updatePermissionList(rolePermissionList) {
        for (let i = 0; i < rolePermissionList.length; i++) {
            let rolePermission = rolePermissionList[i];
            let permission = rolePermission.permission.split(".");
            if (permission.length > 1) {
                rolePermission.text = "Can " + permission[1] + " " + rolePermission.featureName;
            }
        }
    }

    private getAllFeatures() {
        this.permissionService.getMenus()
            .subscribe(
            results => {
                this.featureList = results;
                this.featureList = this.getFilteredFeatureList();
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    private getFilteredFeatureList() {
        let featureList = [];
        for (var index = 0; index < this.featureList.length; index++) {
            let count = _.filter(this.rolePermissionList, { featureName: this.featureList[index].FeatureName }).length;
            if (count != this.featureList[index].permissions.length) {
                featureList.push(this.featureList[index]);
            }
        }
        return featureList;
    }

    getFeaturePermissions(feature) {
        let permissionsList = [];
        this.permissionList = feature.permissions;
        this.getfilteredPermissions(feature.menuName)
    }

    private getfilteredPermissions(menuName) {
        this.filteredPermissionList = [];
        for (let i = 0; i < this.permissionList.length; i++) {
            let permission = this.permissionList[i];
            let rolePermissionData = _.find(this.rolePermissionList, { permission: permission.permissionName })
            if (rolePermissionData == null) {
                if (menuName) {
                    let permissionName = permission.permissionName.split(".");
                    if (permissionName.length > 1) {
                        permission.text = "Can " + permissionName[1] + " " + menuName;
                    }
                }
                this.filteredPermissionList.push(permission);
            }
        }
    }
}
