import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Institutes } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class InstitutesService {
  constructor(private http: Http) {
  }

  getAllInstitutes() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Institutes', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getInstituteCount(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'Institutes/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }
   getAllInstitutesList(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'Institutes' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }

   getInstituteById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'Institutes/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
   createInstitute(institute: Institutes) {
    return this.http.post(AppSettings.API_ENDPOINT +'Institutes', institute, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateInstitute(institute: Institutes) {
    return this.http.patch(AppSettings.API_ENDPOINT +'Institutes/' + institute.id, institute, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteInstitute(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'Institutes/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
