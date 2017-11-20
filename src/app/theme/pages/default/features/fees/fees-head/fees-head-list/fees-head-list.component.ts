import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { FeesService } from '../../../../_services/fees.service';
import { Fees } from "../../../../_models/fees";
import { Pipe, PipeTransform } from '@angular/core';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';


@Component({
  selector: "app-users-list",
  templateUrl: "./fees-head-list.component.html",
  encapsulation: ViewEncapsulation.None,
})



export class FeesHeadListComponent implements OnInit {
  feesList: Observable<Fees[]>;;
  constructor(private router: Router, private feesService: FeesService, private globalErrorHandler: GlobalErrorHandler, private messageService: MessageService) {
  }
  ngOnInit() {
    this.getAllFees();
  }
  getAllFees() {
    this.feesList = this.feesService.getAllFees();
  }
  onManageFeeClick(data: Fees) {
    this.router.navigate(['/features/fees/feesHead/edit', data.id]);
  }

  onFeeDeleteClick(data: Fees) {
    this.feesService.deleteFee(data.id).subscribe(
      results => {
        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
        this.getAllFees();
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onAddFees() {
    this.router.navigate(['/features/fees/feesHead/add']);
  }
}
