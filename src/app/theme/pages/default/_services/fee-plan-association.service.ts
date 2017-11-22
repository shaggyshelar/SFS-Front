import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FeePlanAssociationService {
    constructor(private http: Http) {
    }
    getFeePlanAssociationById(id: number) {
        return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/FeePlans/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    createFeePlanAssociation(feePlanAssociation: any, id: number) {
        return this.http.post(AppSettings.API_ENDPOINT + 'Feeplans/' + id + '/associations', feePlanAssociation, AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    updateFeePlanAssociation(feePlanAssociation: any, id: number) {
        return this.http.put(AppSettings.API_ENDPOINT + 'Feeplans/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    deleteFeePlanAssociation(id: number) {
        return this.http.delete(AppSettings.API_ENDPOINT + 'Feeplans/' + id + '/associations', AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    getFeePlanAssociationCount(url) {
        return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/FeePlans/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    getAllFeePlanAssociationList(url) {
        return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem('schoolId') + '/FeePlans' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
    }
}
