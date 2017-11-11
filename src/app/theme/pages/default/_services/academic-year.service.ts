import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { AcademicYear } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class AcademicYearService {
  constructor(private http: Http) {
  }
  getAllAcademicYears() {
    return this.http.get(AppSettings.API_ENDPOINT + 'AcademicYears', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getAcademicYearById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'AcademicYears/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createAcademicYear(AcademicYear: AcademicYear) {
    return this.http.post(AppSettings.API_ENDPOINT +'AcademicYears', AcademicYear, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateAcademicYear(AcademicYear: AcademicYear) {
    return this.http.patch(AppSettings.API_ENDPOINT +'AcademicYears/' + AcademicYear.id, AcademicYear, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteAcademicYear(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'AcademicYears/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getAcademicYearCount(url){
    return this.http.get(AppSettings.API_ENDPOINT + 'AcademicYears/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());      
  }
  getAllAcademicYearList(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'AcademicYears' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }
}
