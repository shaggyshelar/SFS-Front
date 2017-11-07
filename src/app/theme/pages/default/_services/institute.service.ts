import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Institutes } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class InstitutesService {
  constructor(private http: Http) {
  }

  getAllInstitutes() {
      return [{
            id: 1,
            InstituteId: 1,
            InstituteName: "Test1",
      },{
            id: 2,
            InstituteId: 2,
            InstituteName: "Test2",
      }]
   // return this.http.get(AppSettings.API_ENDPOINT + 'institutes', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }


getSchoolsByInstitute(id: number) {
      return [{
            id: 1,
            SchoolId: 1,
            SchoolName: "Test1School",
      },{
            id: 2,
            SchoolId: 2,
            SchoolName: "Test2School",
      }]
   // return this.http.get(AppSettings.API_ENDPOINT + 'institutes', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

}
