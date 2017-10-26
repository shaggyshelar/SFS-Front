/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { UserService } from '../../../_services/user.service';
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
        private userService: UserService,
        private route: ActivatedRoute, private router: Router) {
    }
    ngOnInit() {
        this.userForm = this.formBuilder.group({
            id: [0],
            UserName: ['', [Validators.required]],
            Password: ['', [Validators.required]],
        });
        this.route.params.forEach((params: Params) => {
            this.params = params['userId'];
            if (this.params) {
            this.userService.getUserById(this.params)
                .subscribe((results:User) => {
                    this.userForm.setValue({
                        id: results.id,
                        UserName: results.UserName
                    });
                })             
            }
        });
    }

    onSubmit({ value, valid }: { value: User, valid: boolean }) {
        if (this.params) {
            this.userService.updateUser(value)
                .subscribe(
                results => {
                    this.router.navigate(['/features/users/list']);
                },
                error => this.errorMessage = <any>error);
        } else {
            this.userService.createUser(value)
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

