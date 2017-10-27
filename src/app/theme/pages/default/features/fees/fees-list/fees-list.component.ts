import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { FeesService } from '../../../_services/fees.service';
import { Fees } from "../../../_models/fees";

@Component({
  selector: "app-users-list",
  templateUrl: "./fees-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FeesListComponent implements OnInit {
  feesList: Observable<Fees[]>;  ;
  constructor(private router: Router, private feesService: FeesService) {
  }

  ngOnInit() {
    this.getAllFees();
  }
  getAllFees() {
    this.feesList = this.feesService.getAllFees();
  }
  onManageFeeClick(data: Fees) {
    debugger;
    this.router.navigate(['/features/fees/edit', data.id]);
  }

  onFeeDeleteClick(data: Fees) {
    debugger;
    this.feesService.deleteFee(data.id).subscribe((results: any) => {
      this.getAllFees();
    })
  }

  onAddFees() {
    this.router.navigate(['/features/fees/add']);
  }
}
