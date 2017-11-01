import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { Pipe, PipeTransform } from '@angular/core';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';


@Component({
  selector: "app-users-list",
  templateUrl: "./board.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class BoardComponent implements OnInit {

  constructor(private router: Router,  private globalErrorHandler: GlobalErrorHandler, private messageService: MessageService) {
  }
  ngOnInit() {
  }
 
}
