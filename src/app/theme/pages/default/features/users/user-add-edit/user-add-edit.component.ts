/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { UserService, InstitutesService, RoleService, SchoolService } from '../../../_services/index';
import { User } from "../../../_models/user";
import { Helpers } from "../../../../../../helpers";

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
    _tempSchoolList: any;
    selectedInstitute: any;
    roleList: any;
    selectedSchoolsValidationError: boolean = false;
    hideInstituteAndSchool: boolean = false;
    relatedSchoolList: any;
    currentUser: any;

    constructor(
        private formBuilder: FormBuilder,
        private globalErrorHandler: GlobalErrorHandler,
        private userService: UserService,
        private roleService: RoleService,
        private institutesService: InstitutesService,
        private schoolService: SchoolService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService) {
    }
    ngOnInit() {
        this.instituteList = [];
        this.schoolList = [];
        this.roleList = [];
        this.relatedSchoolList = [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (this.currentUser && this.currentUser.roles && this.currentUser.roles.length > 0) {
            this.userRole = this.currentUser.roles[0].name;
        }

        this.route.params.forEach((params: Params) => {
            this.params = params['userId'];
        });
        if (this.userRole != 'SuperAdmin') {
            this.getRolesBySchoolId();
        } else {
            this.roleList = [{
                id: 1,
                displayName: 'Super Admin'
            }, {
                id: 2,
                displayName: 'School Admin'
            }]
        }
        if (this.userRole == 'SuperAdmin') {
            this.userForm = this.formBuilder.group({
                id: [],
                username: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                phone: ['', [Validators.pattern('^[0-9]{10,15}$')]],
                institute: ['', [Validators.required]],
                role: ['', [Validators.required]],
                schools: this.buildSchools()
            });
            //this.userForm.controls['role'].setValue(2);
            this.institutesService.getAllInstitutes()
                .subscribe((results: any) => {
                    this.instituteList = results;
                    if (this.params) {
                        this.getEditForm();
                    }
                }, error => {
                    this.globalErrorHandler.handleError(error);
                })
        } else {
            this.userForm = this.formBuilder.group({
                id: [],
                username: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                phone: ['', [Validators.pattern('^[0-9]{10,15}$$')]],
                role: ['', [Validators.required]],
            });

            if (this.params) {
                this.getEditFormWithoutInstitute();
            }
        }

    }
    getEditFormWithoutInstitute() {
        this.userService.getUserById(this.params)
            .subscribe((results: any) => {
                this.userForm.setValue({
                    id: results.id,
                    username: results.username,
                    email: results.email,
                    phone: results.phone,
                    role: results.roleId,
                });
            })
    }

    getEditForm() {
        Helpers.setLoading(true);
        this.userService.getUserById(this.params)
            .subscribe((results: any) => {
                Helpers.setLoading(false);
                this.relatedSchoolList = results.school ? results.school : [];
                var instituteId = -1;
                if (this.relatedSchoolList.length > 0) {
                    instituteId = this.relatedSchoolList[0].instituteId;
                }
                this.userForm.setValue({
                    id: results.id,
                    username: results.username,
                    email: results.email,
                    phone: results.phone,
                    role: results.roleId,
                    institute: instituteId,
                    schools: []
                });
                if (this.relatedSchoolList.length > 0) {
                    this.getSchools(instituteId);
                }
            })

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
            if (this.relatedSchoolList.length > 0) {
                let item = _.find(this.relatedSchoolList, { id: school.id })
                if (item) {
                    school.selected = true;
                }
            }
        }
        return this.schoolList;
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        if (this.userRole == 'SuperAdmin') {
            this.selectedSchoolsValidationError = false
            let selectedSchools = [];
            if (this.userForm.controls['role'].value === 1) {
                this._tempSchoolList.forEach(element => {
                    selectedSchools.push(element.id);
                });
            } else {
                for (var index = 0; index < value.schools.length; index++) {
                    if (value.schools[index] == true) {
                        selectedSchools.push(this.schoolList[index].id);
                    }
                }
            }
            if (selectedSchools.length > 0) {
                let params = {
                    id: value.id,
                    username: value.username,
                    email: value.email,
                    phone: value.phone,
                    instituteId: value.institute,
                    roleId: value.role,
                    schoolIds: selectedSchools,
                }
                this.saveUser(params);
            } else {
                this.selectedSchoolsValidationError = true
            }
        } else {
            var schoolIds = [];
            schoolIds.push(localStorage.getItem('schoolId'));
            let params = {
                id: value.id,
                username: value.username,
                email: value.email,
                phone: value.phone,
                roleId: value.role,
                schoolIds: schoolIds,
            }
            this.saveUser(params);
        }
    }

    saveUser(value) {
        Helpers.setLoading(true);
        if (this.params) {
            this.userService.updateUser(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    Helpers.setLoading(false);
                    this.router.navigate(['/features/users/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                    Helpers.setLoading(false);
                });
        } else {
            this.userService.createUser(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    Helpers.setLoading(false);
                    this.router.navigate(['/features/users/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                    Helpers.setLoading(false);
                });
        }
    }
    getRolesBySchoolId() {
        this.schoolService.getRolesBySchoolId('')
            .subscribe(
            results => {
                this.roleList = <any>results;
            }, error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    onCancel() {
        this.router.navigate(['/features/users/list']);
    }

    onChangeInstitutes(value) {
        this.selectedSchoolsValidationError = false;
        if (value != 'null') {
            this.schoolService.getSchoolsByInstitute(value)
                .subscribe((results: any) => {
                    this.schoolList = results;
                    this.schoolList = this.updateSchoolList();
                    this.userForm.removeControl('schools');
                    this.userForm.addControl('schools', this.buildSchools());
                }, error => {
                    this.globalErrorHandler.handleError(error);
                })

        } else {
            this.schoolList = [];
            this.userForm.removeControl('schools');
            this.userForm.addControl('schools', this.buildSchools());
        }
    }

    getSchools(value) {
        this.schoolService.getSchoolsByInstitute(value)
            .subscribe((results: any) => {
                this.schoolList = results;
                this.schoolList = this.updateSchoolList();
                this.userForm.removeControl('schools');
                this.userForm.addControl('schools', this.buildSchools());
            }, error => {
                this.globalErrorHandler.handleError(error);
            })
    }
    onRoleClick() {
        if (this.userForm.controls['role'].value === 1) {
            this.hideInstituteAndSchool = true;
              this.schoolList = [];
            this.userForm.controls['institute'].setValue('null');
            this._tempSchoolList = [];
            this.userForm.removeControl('schools');
            this.userForm.addControl('schools', this.buildSchools());
            this.schoolService.getAllSchools('')
                .subscribe((results: any) => {
                    this._tempSchoolList = results;
                    //this._tempSchoolList = this.updateSchoolList();
                }, error => {
                    this.globalErrorHandler.handleError(error);
                })
        } else {
            
            this.hideInstituteAndSchool = false;
        }
    }
}
