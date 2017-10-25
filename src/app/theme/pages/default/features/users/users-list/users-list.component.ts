import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { UsersService } from '../../../_services/users.service';
import { User } from "../../../_models/user";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit {
  userList :  Observable<User[]>;  
  constructor( private UsersService: UsersService, private router: Router) {
  }

  ngOnInit() {
    this.getAllUsers();
  }

    getAllUsers() {
      this.UsersService.getAllUsers().subscribe((results:any) => {                      
          this.userList =  results;
      })
    }
    onManageRoleClick(data: any) {
        this.router.navigate(['/features/users/manage-role', data.ID]);
    }
    onEditClick(user: User) {
      this.router.navigate(['/features/users/edit', user.ID]);
    }
    onDelete(user: User) {
       this.UsersService.deleteUser(user.ID).subscribe((results:any) => {                      
           this.getAllUsers();
        })
    }
    onAddClick() {
      this.router.navigate(['/features/users/add']);
    }
}
