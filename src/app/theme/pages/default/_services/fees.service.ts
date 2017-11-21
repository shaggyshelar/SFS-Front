import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Fees } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FeesService {
  constructor(private http: Http) {
  }

  getAllFees() {
   return this.http.get(AppSettings.API_ENDPOINT + 'Feeheads', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getAllFeesList(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'Feeheads' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }

   getFeesCount(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'Feeheads/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }

  getFeeById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'Feeheads/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createFees(fees: Fees) {
    return this.http.post(AppSettings.API_ENDPOINT +'Feeheads', fees, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateFees(fees: Fees) {
    return this.http.patch(AppSettings.API_ENDPOINT +'Feeheads/' + fees.id, fees, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteFee(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'Feeheads/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
