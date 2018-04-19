import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { SchoolClass } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class ClassService {
  constructor(private http: Http) {
  }
  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllClassList(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolClass' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllClasses() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolClass', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getClasseCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolClass/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getClassById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolClass/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getClassBySchoolId(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + id + '/SchoolClass', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getDivisionBySchoolId(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + id + '/SchoolDivision', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getFeePlansBySchoolId(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + id + '/FeePlans', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getCategoryBySchoolId(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + id + '/Schoolcategories', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createClass(schoolClass: SchoolClass) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolClass/', schoolClass, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateClass(schoolClass: SchoolClass) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/SchoolClass/' + schoolClass.id, schoolClass, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteClass(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Classes/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
    //return this.http.delete(AppSettings.API_ENDPOINT + 'Schools/'+ localStorage.getItem("schoolId")+'/SchoolClass/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
