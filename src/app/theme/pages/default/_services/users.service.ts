import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { User } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class UsersService {
  constructor(private http: Http) {
  }

  getAllUsers() {
   return this.http.get(AppSettings.API_ENDPOINT + 'api/users', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getUserById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'/api/users/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createUser(user: User) {
    return this.http.post(AppSettings.API_ENDPOINT +'/api/users', user, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateUser(user: User) {
    return this.http.put(AppSettings.API_ENDPOINT +'/api/users/' + user.ID, user, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteUser(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'/api/users/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
