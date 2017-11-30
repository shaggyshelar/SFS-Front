import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Transport } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TransportService {
  constructor(private http: Http) {
  }
  getAllTransports(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/zones' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  createTransport(transport: Transport[]) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Zones/', transport, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  addZoneDetails(transport: Transport[]) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Zonedetails/updateZonedetails', transport, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  updateTransport(transport: Transport) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'Zones/' + transport.id, transport, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteTransport(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Zones/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
