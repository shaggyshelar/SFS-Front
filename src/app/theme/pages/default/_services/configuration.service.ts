import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { AppSettings } from '../../../../app-settings';

@Injectable()
export class ConfigurationService {
  constructor(private http: Http) {
  }
  getAllMerchants(id) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    return this.http.get(AppSettings.API_ENDPOINT + 'Schoolmerchants', requestOptions).map((response: Response) => response.json());
  }
  createMerchant(merchant: any) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Schoolmerchants', merchant, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateConfiguration(config: any) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'Schoolmerchants/' + config.id, config, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteMerchant(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Schoolmerchants/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
