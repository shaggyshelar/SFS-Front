import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { AdhocFee } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class AdhocFeeService {
  constructor(private http: Http) {
  }


  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllAdhocFees() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/Adhocfees', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAdhocFeeById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/Adhocfees/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createAdhocFee(adhocFee: AdhocFee) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/Adhocfees', adhocFee, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateAdhocFee(adhocFee: any) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'Adhocfees/' + adhocFee.id, adhocFee, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateAdhocFeeAssociation(adhocFeeAssociation: any) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Adhocfeedetails/updateAdhocfeedetails', adhocFeeAssociation, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteAdhocFee(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Adhocfees/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getAdhocFeeCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/Adhocfees/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getAllAdhocFeeList(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/Adhocfees' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
