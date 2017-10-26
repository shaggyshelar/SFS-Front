import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { School } from "../_models/School";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class SchoolService {
  constructor(private http: Http) {
  }

  getAllSchools() {   
   return this.http.get(AppSettings.API_ENDPOINT + 'schools', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getSchoolById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'schools/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createSchool(school: School) {
    return this.http.post(AppSettings.API_ENDPOINT +'schools', school, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateSchool(school: School) {
    return this.http.put(AppSettings.API_ENDPOINT +'schools/' + school.id, school, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteSchool(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'schools/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
