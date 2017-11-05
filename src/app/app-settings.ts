import { Headers, Http, RequestOptions, Response } from "@angular/http";

export class AppSettings {

   public static API_ENDPOINT='http://localhost:3000/api/';
   public static LOGIN_API_ENDPOINT='http://localhost:3000/';

   public static requestOptions() {
     let headers = new Headers({ 'Content-Type': 'application/json'});  
    
    // create authorization header with jwt token
     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
     if (currentUser && currentUser.token) {
       headers.append('Authorization', currentUser.token);
     }
    let options = new RequestOptions({ headers: headers });
     return new RequestOptions({ headers: headers });
  }
}