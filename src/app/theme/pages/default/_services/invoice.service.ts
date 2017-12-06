import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Merchant } from "../_models/Merchant";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class InvoiceService {
  constructor(private http: Http) {
  }
  records = [
    {
      invoiceno: 1111,
      date: '27/11/2017',
      studentName: 'Amol',
      status: 'open',
      amount: 5000,
    },
    {
      invoiceno: 2222,
      date: '27/11/2017',
      studentName: 'Amol 2',
      status: 'Closed',
      amount: 8000,
    },
    {
      invoiceno: 3333,
      date: '27/11/2017',
      studentName: 'Amol 3',
      status: 'open',
      amount: 9000,
    }
  ]
  getAllInvoices(url) {
    let params: URLSearchParams = new URLSearchParams();
    // params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    // return this.records;
    return this.http.get(AppSettings.API_ENDPOINT + 'invoices' + url, requestOptions).map((response: Response) => response.json());
  }

  getInvoiceSumary(id, url) {
    let params: URLSearchParams = new URLSearchParams();
    // params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    // return this.records;
    return this.http.get(AppSettings.API_ENDPOINT + 'invoices/' + id + url, requestOptions).map((response: Response) => response.json());
  }

  updateInvoice(invoice: any) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'invoice/' + invoice.id, invoice, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
