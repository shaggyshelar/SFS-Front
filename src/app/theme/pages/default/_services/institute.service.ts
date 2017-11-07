import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Institutes } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class InstitutesService {
  constructor(private http: Http) {
  }

  getAllInstitutes() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Institutes', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

}
