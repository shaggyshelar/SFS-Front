import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: "app-users-list",
    templateUrl: "./school-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class SchoolListComponent implements OnInit {
    userList : any;  
    constructor(private router: Router) {
    }

    ngOnInit() {
        this.userList = [{
            ID: 1,
            SchoolName: "School1",
            SchoolCode: 'admin',
            SchoolEmail : 'school1@school1.com',
            SchoolPhone : '5474125879',
            SchoolAddress : 'My School adderess is as mentioned.'
        },
        {
            ID: 2,
            SchoolName: "School1",
            SchoolCode: 'admin',
            SchoolEmail : 'school1@school1.com',
            SchoolPhone : '5474125879',
            SchoolAddress : 'My School adderess is as mentioned.'
        },
        {
            ID: 3,
            SchoolName: "School1",
            SchoolCode: 'admin',
            SchoolEmail : 'school1@school1.com',
            SchoolPhone : '5474125879',
            SchoolAddress : 'My School adderess is as mentioned.'
        },
        {
            ID: 4,
            SchoolName: "School1",
            SchoolCode: 'admin',
            SchoolEmail : 'school1@school1.com',
            SchoolPhone : '5474125879',
            SchoolAddress : 'My School adderess is as mentioned.'
        }];

    }
    onAddSchool() {
        this.router.navigate(['/features/school/add']);
      }

      onManageSchoolClick(data: any) {
          debugger;
        this.router.navigate(['/features/school/edit', data.ID]);
    }
    onSchoolDeleteClick(data: any) {
        debugger;
        alert('Deleted the record having ID : '+ data.ID);
      }
}
