import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { School } from "../_models/School";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class SchoolService {
  constructor(private http: Http) {
  }

  getSchoolCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'schools/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFilterList(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'schools' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllSchools(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'schools' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSchoolById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'schools/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createSchool(school: School) {
    return this.http.post(AppSettings.API_ENDPOINT + 'schools', school, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateSchool(school: School) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'schools/' + school.id, school, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteSchool(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Schools/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSchoolsByInstitute(id) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('filter[where][instituteId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    return this.http.get(AppSettings.API_ENDPOINT + 'schools/', requestOptions).map((response: Response) => response.json());
  }

  getRolesBySchoolId(url) {
    var schoolId = JSON.parse(localStorage.getItem('schoolId'));
    return this.http.get(AppSettings.API_ENDPOINT + 'schools/' + schoolId + '/Roles' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getRolesCountBySchoolId(url) {
    var schoolId = JSON.parse(localStorage.getItem('schoolId'));
    return this.http.get(AppSettings.API_ENDPOINT + 'schools/' + schoolId + '/Roles/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getUsersBySchoolId(url) {
    var schoolId = JSON.parse(localStorage.getItem('schoolId'));
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(AppSettings.API_ENDPOINT + 'Userschooldetails?filter[include]=UserschoolUser&filter[where][schoolId]=' + schoolId + '&filter[where][createdBy]=' + currentUser.userId + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getUsersCountBySchoolId(url) {
    var schoolId = JSON.parse(localStorage.getItem('schoolId'));
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(AppSettings.API_ENDPOINT + 'Userschooldetails/count?where[schoolId]=' + schoolId + '&where[createdBy]=' + currentUser.userId + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getProcessingDays() {
    let days = []
    for (var index = 1; index <= 28; index++) {
      days.push(index);
    }
    return days;
  }

  getGraceDays() {
    let days = []
    for (var index = 1; index <= 99; index++) {
      days.push(index);
    }
    return days;
  }
}
