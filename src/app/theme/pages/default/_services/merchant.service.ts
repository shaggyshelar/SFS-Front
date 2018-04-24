import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Merchant } from "../_models/merchant";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class MerchantService {
  constructor(private http: Http) {
  }
  getAllMerchants(id) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('filter[where][schoolId]', id);
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    return this.http.get(AppSettings.API_ENDPOINT + 'Schoolmerchants', requestOptions).map((response: Response) => response.json());
  }
  createMerchant(merchant: Merchant) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Schoolmerchants', merchant, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateMerchant(merchant: Merchant) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'Schoolmerchants/' + merchant.id, merchant, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteMerchant(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Schoolmerchants/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
