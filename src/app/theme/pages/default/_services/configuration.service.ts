import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { AppSettings } from '../../../../app-settings';

@Injectable()
export class ConfigurationService {
  constructor(private http: Http) {
  }
  getSchoolConfiguration(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/'+id + '/SchoolConfiguration',AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getSFSConfiguration() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Sfsconfigurations' ,AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  createMerchant(merchant: any) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Schoolmerchants', merchant, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateSFSConfiguration(sfsconfig: any) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Sfsconfigurations/updateSFSConfig', sfsconfig, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  updateSchoolConfiguration(schoolconfig: any) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Schoolconfigurations/updateSchoolConfig', schoolconfig, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  deleteMerchant(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Schoolmerchants/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
