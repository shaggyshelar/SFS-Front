import { Headers, Http, RequestOptions, Response, URLSearchParams  } from "@angular/http";
import { Injectable } from "@angular/core";
import { User, Role } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class UserSchoolDetailsService {
    constructor(private http: Http) {
    }
    getSchoolsByUser(id) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('filter[include]', "UserschoolSchool");
        params.set('filter[where][userId]', id);
        let requestOptions = AppSettings.requestOptions();
        requestOptions.params = params;
        return this.http.get(AppSettings.API_ENDPOINT + 'Userschooldetails/', requestOptions).map((response: Response) => response.json());
    }
}
