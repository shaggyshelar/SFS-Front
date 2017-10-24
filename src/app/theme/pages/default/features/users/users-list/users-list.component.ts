import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit {
  userList : any;  
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.userList = [{
        ID: 10,
        Name: 'admin',
    },
    {
        ID: 11,
        Name: 'user1',
    },
    {
        ID: 12,
        Name: 'user2',
    },
    {
        ID: 13,
        Name: 'user3',
    }];
  }

    onManageRoleClick(data: any) {
        this.router.navigate(['/features/users/manage-role', data.ID]);
    }
}
