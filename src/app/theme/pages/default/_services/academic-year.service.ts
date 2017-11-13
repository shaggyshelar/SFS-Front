import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { AcademicYear } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class AcademicYearService {
  constructor(private http: Http) {
  }
  getAllAcademicYears() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/SchoolYear', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getAcademicYearById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/SchoolYear/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createAcademicYear(AcademicYear: AcademicYear) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/SchoolYear', AcademicYear, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateAcademicYear(AcademicYear: any) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'Academicyears/' + AcademicYear.id, AcademicYear, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteAcademicYear(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Academicyears/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getAcademicYearCount(url){
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/SchoolYear/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());      
  }
  getAllAcademicYearList(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/SchoolYear' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }
}
