import { Injectable, ErrorHandler } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import { MessageService } from '../_services/message.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private _router: Router, private messageService: MessageService) {
  }
  /**
    * Method For handling Error in Http request
    */
  handleError(response: Response | any) {
    let errMsg: string;
    let error = response.json().error
    if (error) {
      if (error.statusCode === 401) {
        localStorage.removeItem('currentUser');
        this._router.navigate(['/login']);
      } else {
        errMsg = error.message;
        this.messageService.addMessage({ severity: 'error', summary: 'Failed', detail: errMsg });
      }
    } else {
      console.error(response);
    }
  }
}
