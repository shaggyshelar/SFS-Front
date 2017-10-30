import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';

import { UserService } from '../../../_services/user.service';
import { User } from "../../../_models/user";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit {
  userList :  Observable<User[]>;  
  constructor( private userService: UserService, private router: Router, private globalErrorHandler : GlobalErrorHandler) {
  }

  ngOnInit() {
    this.getAllUsers();
  }

    getAllUsers() {
      this.userList = this.userService.getAllUsers();
    }
    onManageRoleClick(user: User) {
      this.router.navigate(['/features/users/manage-role', user.id]);
    }
    onEditClick(user: User) {
      this.router.navigate(['/features/users/edit', user.id]);
    }
    onDelete(user: User) {
      this.userService.deleteUser(user.id).subscribe(
        (data) => {                      
           this.getAllUsers();
      }, error =>{
         this.globalErrorHandler.handleError(error);
      })
    }
    onAddClick() {
      this.router.navigate(['/features/users/add']);
    }
}
