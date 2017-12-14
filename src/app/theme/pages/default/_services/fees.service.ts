import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Fees, FeePlan, FeePlanDetails } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FeesService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllFees() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Feeheads', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllFeesList(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Feeheads' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFeesCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Feeheads/count?&where[schoolId]='+localStorage.getItem('schoolId'), AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFeeById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Feeheads/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createFees(fees: Fees) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Feeheads', fees, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateFees(fees: Fees) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'Feeheads/' + fees.id, fees, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteFee(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Feeheads/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  //FeesPlan

  getAllFeePlans(url) {
    var schoolId = JSON.parse(localStorage.getItem('schoolId'));
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + schoolId + '/FeePlans' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllFeePlanCount(url) {
    var schoolId = JSON.parse(localStorage.getItem('schoolId'));
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + schoolId + '/FeePlans/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFeePlanById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Feeplans/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createFeePlan(fees: FeePlan) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Feeplans', fees, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateFeePlan(fees: FeePlan) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'Feeplans/' + fees.id, fees, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteFeePlan(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Feeplans/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createFeeplanheaddetails(value) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Feeplanheaddetails/updateFeeplanheaddetails', value, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllFeeplanheaddetails(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Feeplanheaddetails' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
