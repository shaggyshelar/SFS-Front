import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Feature } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FeatureService {
  constructor(private http: Http) {
  }

  getAllFeatures() {   
   return this.http.get(AppSettings.API_ENDPOINT + 'featurelists', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }
}
