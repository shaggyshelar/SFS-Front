import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { FeesService } from '../../../_services/fees.service';
import { Fees } from "../../../_models/fees";
import { Pipe, PipeTransform } from '@angular/core';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';


@Component({
  selector: "app-users-list",
  templateUrl: "./transport.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class TransportComponent implements OnInit {

  constructor(private router: Router, private feesService: FeesService, private globalErrorHandler: GlobalErrorHandler, private messageService: MessageService) {
  }
  ngOnInit() {
  }
 
}
