import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { AppSettings } from '../../app-settings';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) {
  }
  login(email: string, password: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(AppSettings.LOGIN_API_ENDPOINT +'login', JSON.stringify({ email: email, password: password }),options)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let user = response.json();
        if(user.id){
          user['token'] = user.id;
        }
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      });
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
