import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Merchant } from "../_models/merchant";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class InvoiceService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;
  status: any = 'Select';
  startDate: Date;
  endDate: Date;
  getAllInvoices(url) {
    let params: URLSearchParams = new URLSearchParams();
    // params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    // return this.records;
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/SchoolInvoices/' + url, requestOptions).map((response: Response) => response.json());
  }

  getAllStudentInvoiceReport(url) {
    let params: URLSearchParams = new URLSearchParams();
    // params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    // return this.records;
    return this.http.get(AppSettings.API_ENDPOINT + 'schools/' + localStorage.getItem('schoolId') + '/invoiceReports' + url, requestOptions).map((response: Response) => response.json());
  }

  getInvoiceSumary(id, url) {
    let params: URLSearchParams = new URLSearchParams();
    // params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    // return this.records;
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/SchoolInvoices/' + id + url, requestOptions).map((response: Response) => response.json());
  }

  getInvoicesCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolInvoices/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getStudentInvoiceReportCount(url) {
    let params: URLSearchParams = new URLSearchParams();
    // params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    // return this.records;
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/invoiceReports/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllCategoryClassPaymentReport(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'CategoryClassPaymentReports/getCategoryClassPaymentReport?schoolId=' + localStorage.getItem("schoolId") + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getFeeheadPaymentReport(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'FeeHeadPaymentReports/getFeeheadPaymentReport?schoolId=' + localStorage.getItem("schoolId") + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getFeeheadList() {
    return this.http.get(AppSettings.API_ENDPOINT + 'FeeHeadPaymentReports/getFeeheadListReport?schoolId=' + localStorage.getItem("schoolId"), AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  updateInvoice(invoice: any) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'invoices/' + invoice.id, invoice, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
