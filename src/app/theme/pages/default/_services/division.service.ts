import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Division } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class DivisionService {
  constructor(private http: Http) {
  }


  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;
  filterCol1: any = [];
  filterQuery: string='';
  filter1CountQuery: string='';
  filterValue1: string='';

  getAllDivisionList(url) {
    //return this.http.get(AppSettings.API_ENDPOINT + 'Schools/'+ localStorage.getItem("schoolId")+'/SchoolDivision' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
    return this.http.get(AppSettings.API_ENDPOINT + 'Divisions' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllDivisions() {
    //return this.http.get(AppSettings.API_ENDPOINT + 'Institutes', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getDivisionCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolDivision/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getDivisionById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolDivision/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createDivision(division: Division) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolDivision/', division, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateDivision(division: Division) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolDivision/' + division.id, division, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteDivision(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Divisions/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
    //return this.http.delete(AppSettings.API_ENDPOINT + 'Schools/'+ localStorage.getItem("schoolId")+'/SchoolDivision/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
