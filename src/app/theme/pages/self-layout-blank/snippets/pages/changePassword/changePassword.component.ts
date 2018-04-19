import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { UserService } from '../../../../default/_services/user.service';
import * as _ from 'lodash/index';
import { UserSchoolDetailsService } from '../../../../.../../default/_services/userschooldetails.service';

@Component({
    selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
    templateUrl: "./changePassword.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ChangePasswordComponent implements OnInit {
    changePasswordForm: FormGroup;
    loading = false;
    isConfirmPasswordSame: boolean = true;
    constructor(
        private formBuilder: FormBuilder,
        private globalErrorHandler: GlobalErrorHandler,
        private router: Router,
        private userService: UserService,
        private userSchoolDetailsService: UserSchoolDetailsService,
        private messageService: MessageService) {
    }

    ngOnInit() {
        this.changePasswordForm = this.formBuilder.group({
            oldPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
        });
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        this.isConfirmPasswordSame = true;
        if (value.confirmPassword === value.newPassword) {
            this.loading = true;
            this.userService.changePassword(value)
                .subscribe(
                results => {
                    this.loading = false;
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Password Updated Successfully' });
                    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                    let _superAdmin = _.find(currentUser.roles, { 'name': 'SuperAdmin' });
                    if (!_superAdmin) {
                        this.userSchoolDetailsService.getSchoolsByUser(currentUser.userId)
                            .subscribe(
                            results => {
                                if (results.length > 1) {
                                    this.router.navigate(['/selectSchool']);
                                }
                                else {
                                    localStorage.setItem('schoolLogo', results[0].UserschoolSchool.schoolLogo);
                                    localStorage.setItem('schoolHeader', results[0].UserschoolSchool.schoolHeader);
                                    localStorage.setItem('schoolId', results[0].UserschoolSchool.id);
                                    localStorage.setItem('instituteId', results[0].UserschoolSchool.instituteId);
                                    this.router.navigate(['/']);
                                };
                            },
                            error => {
                                this.globalErrorHandler.handleError(error);
                            });
                    }
                    else {
                        this.router.navigate(['/']);
                    }
                },
                error => {
                    this.loading = false;
                    this.globalErrorHandler.handleError(error);
                    this.isConfirmPasswordSame = true;
                });
        } else {
            this.isConfirmPasswordSame = false;
        }
    }
    onCancel() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('instituteId');
        localStorage.removeItem('schoolId');
        localStorage.removeItem('schoolLogo' );
        localStorage.removeItem('schoolHeader');
        this.router.navigate(['/login']);
    }
}
