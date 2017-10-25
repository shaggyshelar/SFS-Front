/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { UsersService } from '../../../_services/users.service';
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

    constructor(
        private formBuilder: FormBuilder,
        private UsersService: UsersService,
        private route: ActivatedRoute, private router: Router) {
    }
    ngOnInit() {
        this.userForm = this.formBuilder.group({
            ID: [0],
            UserName: ['', [Validators.required]],
            Password: ['', [Validators.required]],
        });
        this.route.params.forEach((params: Params) => {
            this.params = params['userId'];
            if (this.params) {
            this.UsersService.getUserById(this.params)
                .subscribe((results:User) => {
                    this.userForm.setValue({
                        ID: results.ID,
                        Name: results.UserName
                    });
                })             
            }
        });
    }

    onSubmit({ value, valid }: { value: User, valid: boolean }) {
        if (this.params) {
            this.UsersService.updateUser(value)
                .subscribe(
                results => {
                    this.router.navigate(['/features/users/list']);
                },
                error => this.errorMessage = <any>error);
        } else {
            this.UsersService.createUser(value)
                .subscribe(
                results => {
                    this.router.navigate(['/features/users/list']);
                },
                error => this.errorMessage = <any>error);
        }
    }

    onCancel() {
        this.router.navigate(['/features/users/list']);
    }  
}

