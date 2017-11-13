import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Frequencies } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FrequencyService {
  constructor(private http: Http) {
  }

  getAllFrequency() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Frequencies', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getFrequencyCount(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'Frequencies/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }
   getAllFrequencyList(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'Frequencies' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }

   getFrequencyById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'Frequencies/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
   createFrequency(Frequency: Frequencies) {
    return this.http.post(AppSettings.API_ENDPOINT +'Frequencies', Frequency, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateFrequency(Frequency: Frequencies) {
    return this.http.patch(AppSettings.API_ENDPOINT +'Frequencies/' + Frequency.id, Frequency, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteFrequency(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'Frequencies/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
