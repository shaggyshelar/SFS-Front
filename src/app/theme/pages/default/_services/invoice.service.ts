import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Merchant } from "../_models/Merchant";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class InvoiceService {
  constructor(private http: Http) {
  }

  getAllInvoices(url) {
    let params: URLSearchParams = new URLSearchParams();
    // params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    // return this.records;
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/'+ localStorage.getItem('schoolId') +'/SchoolInvoices/' + url, requestOptions).map((response: Response) => response.json());
  }

  getInvoiceSumary(id, url) {
    let params: URLSearchParams = new URLSearchParams();
    // params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    // return this.records;
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/'+localStorage.getItem('schoolId')+'/SchoolInvoices/' + id + url, requestOptions).map((response: Response) => response.json());
  }

  getInvoicesCount(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/'+ localStorage.getItem("schoolId")+'/SchoolInvoices/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }

  updateInvoice(invoice: any) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'invoices/' + invoice.id, invoice, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
