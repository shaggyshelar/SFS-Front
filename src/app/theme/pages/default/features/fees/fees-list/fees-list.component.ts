import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: "app-users-list",
  templateUrl: "./fees-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FeesListComponent implements OnInit {
  feesList: any;
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.feesList = [{
      ID: 1,
      FeeHeadName: "1",
      FeeHeadCharges: '11',
    },
    {
      ID: 2,
      FeeHeadName: "2",
      FeeHeadCharges: '11',
    },
    {
      ID: 3,
      FeeHeadName: "3",
      FeeHeadCharges: '11',
    },
    {
      ID: 4,
      FeeHeadName: "4",
      FeeHeadCharges: '11',
    },
    ];
  }

  onManageFeeClick(data: any) {
    debugger;
    this.router.navigate(['/features/fees/edit', data.ID]);
  }
  onFeeDeleteClick(data: any) {
    debugger;
    //this.router.navigate(['/features/categories/edit', data.ID]);
    alert('Deleted the record having ID : ' + data.ID);
  }

  onAddFees() {
    this.router.navigate(['/features/fees/add']);
  }
}
