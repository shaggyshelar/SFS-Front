import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Fees,FeePlan } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FeesService {
  constructor(private http: Http) {
  }

  getAllFees() {
   return this.http.get(AppSettings.API_ENDPOINT + 'feeheads', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getFeeById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'feeheads/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createFees(fees: Fees) {
    return this.http.post(AppSettings.API_ENDPOINT +'feeheads', fees, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateFees(fees: Fees) {
    return this.http.put(AppSettings.API_ENDPOINT +'feeheads/' + fees.id, fees, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteFee(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'feeheads/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  //FeesPlan

  getAllFeePlans() {
    return this.http.get(AppSettings.API_ENDPOINT + 'feeheads', AppSettings.requestOptions()).map((response: Response) => response.json());  
   }
 
   getFeePlanById(id: number) {
     return this.http.get(AppSettings.API_ENDPOINT +'feeheads/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
   }
 
   createFeePlan(fees: FeePlan) {
     return this.http.post(AppSettings.API_ENDPOINT +'feeheads', fees, AppSettings.requestOptions()).map((response: Response) => response.json());
   }
 
   updateFeePlan(fees: FeePlan) {
     return this.http.put(AppSettings.API_ENDPOINT +'feeheads/' + fees.id, fees, AppSettings.requestOptions()).map((response: Response) => response.json());
   }
 
   deleteFeePlan(id: number) {
     return this.http.delete(AppSettings.API_ENDPOINT +'feeheads/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
   }
}
