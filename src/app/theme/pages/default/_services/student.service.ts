import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Student } from "../_models/student";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class StudentService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  addStudents(file) {
    let reqObj = AppSettings.requestOptions();
    reqObj.headers["_headers"].delete("content-type");
    return this.http.post(AppSettings.API_ENDPOINT + 'uploadcsv/', file, reqObj).map((response: Response) => response.json());
  }
  getStudentCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Students/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  //  getFilterList(url) {   
  //   return this.http.get(AppSettings.API_ENDPOINT + 'students' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
  //  }

  getAllStudents(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Students/' + localStorage.getItem("schoolId") + '/getStudentDetails' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getStudentById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Students/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  updateStudent(student: Student) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Students/' + student.id, student, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  registerAndProcess(params: any) {
    return this.http.post(AppSettings.LOGIN_API_ENDPOINT + 'registerStudent', params, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteStudent(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Students/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
