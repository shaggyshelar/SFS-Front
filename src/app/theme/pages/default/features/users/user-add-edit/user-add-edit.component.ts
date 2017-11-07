/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { UserService, InstitutesService, RoleService } from '../../../_services/index';
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
    userRole: string;
    instituteList: any;
    schoolList: any;
    selectedInstitute: any;
    roleList: any;
    selectedSchoolsValidationError: boolean = false

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
        if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
            this.userRole = currentUser.roles[0].displayName;
        }

        this.userForm = this.formBuilder.group({
            id: [],
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            contact: ['', [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]],
            password: ['opensesane'],
            institute: this.userRole == 'admin' ? ['', [Validators.required]] : [''],
            role: ['', [Validators.required]],
            schools: this.buildSchools()
        });

        if (this.userRole == 'admin') {
            // this.institutesService.getAllInstitutes
            //     .subscribe((results: any) => {
            //         this.instituteList = results;
            //     }, error => {
            //         this.globalErrorHandler.handleError(error);
            //     })
            this.instituteList = this.institutesService.getAllInstitutes();
        }

        this.userForm = this.formBuilder.group({
            id: [],
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            contact: ['', [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]],
            password: ['opensesane'],
            institute: ['', [Validators.required]],
            role: ['', [Validators.required]],
            schools: this.buildSchools()
        });
        this.getAllRoles();

        //edit
        this.route.params.forEach((params: Params) => {
            this.params = params['userId'];
            if (this.params) {
                this.userService.getUserById(this.params)
                    .subscribe((results: any) => {
                        this.userForm.setValue({
                            id: results.id,
                            username: results.username,
                            email: results.email,
                            contact: results.contact,
                            password: 'opensesane',
                            institute : 1,
                            role : 1
                        });
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    })
            }
        });
    }

    get schools(): FormArray {
        return this.userForm.get('schools') as FormArray;
    };
    buildSchools() {
        const arr = this.schoolList.map(s => {
            return this.formBuilder.control(s.selected);
        })
        return this.formBuilder.array(arr);
    }
    updateSchoolList() {
        for (var index = 0; index < this.schoolList.length; index++) {
            var school = this.schoolList[index];
            school.selected = false;

        }
        return this.schoolList;
    }
    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        if (this.userRole == 'admin') {
            this.selectedSchoolsValidationError = false
            let selectedSchools = [];
            for (var index = 0; index < value.schools.length; index++) {
                if (value.schools[index] == true) {
                    selectedSchools.push(this.schoolList[index].id);
                }
            }
            if (selectedSchools.length > 0) {
                let params = {
                    username: value.username,
                    email: value.email,
                    contact: value.contact,
                    instituteId: value.institute,
                    roleId: value.role,
                    selectedSchools: selectedSchools
                }
                console.log('params', params);
               // this.saveUser(params);
            } else {
                this.selectedSchoolsValidationError = true
            }
        } else {
            let params = {
                username: value.username,
                email: value.email,
                contact: value.contact,
                roleId: value.role,
                schoolId: '1' //get from local storage.
            }
            console.log('params', params);
           // this.saveUser(params);
        }
    }

    saveUser(value) {
        if (this.params) {
            this.userService.updateUser(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/users/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            this.userService.createUser(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/users/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
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
        if (value != 'null') {
            this.schoolList = this.institutesService.getSchoolsByInstitute(value);
            this.updateSchoolList();
            // this.institutesService.getSchoolsByInstitute(value)
            //     .subscribe((results: any) => {
            //         this.schoolList = results;
            //         this.schoolList = this.updateSchoolList();
            //     }, error => {
            //         this.globalErrorHandler.handleError(error);
            //     })
            this.userForm.removeControl('schools');
            this.userForm.addControl('schools', this.buildSchools());
        } else {
            this.schoolList = [];
            this.userForm.removeControl('schools');
            this.userForm.addControl('schools', this.buildSchools());
        }
    }
}
