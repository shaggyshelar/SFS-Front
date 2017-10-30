import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Student } from "../_models/Student";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class StudentService {
  constructor(private http: Http) {
  }

  getAllStudents() {   
   return this.http.get(AppSettings.API_ENDPOINT + 'students', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getStudentById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'students/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  updateStudent(school: Student) {
    return this.http.put(AppSettings.API_ENDPOINT +'students/' + school.id, school, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteStudent(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'students/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
