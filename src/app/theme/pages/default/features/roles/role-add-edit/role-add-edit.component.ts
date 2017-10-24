/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
        private formBuilder: FormBuilder,
        private route: ActivatedRoute, private router: Router) {
    }
    ngOnInit() {
        this.roleForm = this.formBuilder.group({
            ID: [0],
            Name: ['', [Validators.required]],
        });
        this.route.params.forEach((params: Params) => {
            this.params = params['roleId'];
            if (this.params) {
                 this.roleForm.setValue({
                    ID: 1,
                    Name: 'SuperAdmin',
                });
                this.getAllPermissions();
                this.getPermissionsByRole();               
            }
        });
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        if (this.params) {
          this.router.navigate(['/features/roles/list']);
        } else {
            this.router.navigate(['/features/roles/list']);
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

