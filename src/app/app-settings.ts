import { Headers, Http, RequestOptions, Response } from "@angular/http";

export class AppSettings {

   public static API_ENDPOINT='http://localhost:3000';

   public static requestOptions() {
     let headers = new Headers({ 'Content-Type': 'application/json'});  
    
    // create authorization header with jwt token
    let currentUserToken = JSON.parse(localStorage.getItem('token'));
    if (currentUserToken) {
       headers.append('Authorization', 'Bearer ' + currentUserToken);
    }
    let options = new RequestOptions({ headers: headers });
     return new RequestOptions({ headers: headers });
  }
}