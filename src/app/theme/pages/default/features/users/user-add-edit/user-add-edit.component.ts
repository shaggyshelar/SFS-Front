/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { UserService , InstitutesService, RoleService } from '../../../_services/index';
import { User } from "../../../_models/user";

/** Component Declaration */
@Component({
    selector: 'app-user-add-edit',
    templateUrl: './user-add-edit.component.html',
})

export class UserAddEditComponent implements OnInit {
    errorMessage: any;
    params: number;
    userForm: FormGroup;
    userRole : string;
    instituteList: any;
    schoolList: any;
    selectedInstitute: any;
    roleList: any;

    constructor(
        private formBuilder: FormBuilder,
        private globalErrorHandler: GlobalErrorHandler,
        private userService: UserService,
        private roleService: RoleService,
        private institutesService: InstitutesService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService) {
    }
    ngOnInit() {
        this.instituteList = [];
        this.schoolList = [];
        this.roleList = [];
         let currentUser = JSON.parse(localStorage.getItem('currentUser'));
         if(currentUser && currentUser.roles && currentUser.roles.length > 0 ){
           this.userRole = currentUser.roles[0].displayName;
         }

        if(this.userRole == 'admin'){
          this.instituteList = this.institutesService.getAllInstitutes();
        }

        if(this.userRole == 'SchoolAdmin'){
            this.schoolList = this.institutesService.getSchoolsByInstitute(1);
        }
        this.userForm = this.formBuilder.group({
            id: [],
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['opensesane'],
            institute : ['', [Validators.required]],
            role: ['', [Validators.required]],
            sidekick :[''],
        });
        this.getAllRoles();
        this.route.params.forEach((params: Params) => {
            this.params = params['userId'];
            if (this.params) {
                this.userService.getUserById(this.params)
                    .subscribe((results: User) => {
                        this.userForm.setValue({
                            id: results.id,
                            username: results.username,
                            email: results.email,
                            password: 'opensesane',
                        });
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    })
            }
        });
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        console.log('value', value);
        // if (this.params) {
        //     this.userService.updateUser(value)
        //         .subscribe(
        //         results => {
        //             this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
        //             this.router.navigate(['/features/users/list']);
        //         },
        //         error => {
        //             this.globalErrorHandler.handleError(error);
        //         });
        // } else {
        //     this.userService.createUser(value)
        //         .subscribe(
        //         results => {
        //             this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
        //             this.router.navigate(['/features/users/list']);
        //         },
        //         error => {
        //             this.globalErrorHandler.handleError(error);
        //         });
        // }
    }

   getAllRoles() {
    this.roleService.getAllRoles()
        .subscribe(
        results => {
            this.roleList = <any>results;
        });
    }

    onCancel() {
        this.router.navigate(['/features/users/list']);
    }

    onChangeInstitutes(value) {
        if(this.selectedInstitute){
            this.schoolList = this.institutesService.getSchoolsByInstitute(this.selectedInstitute.id);
        }else {
            this.schoolList = [];
        }
    }
}

