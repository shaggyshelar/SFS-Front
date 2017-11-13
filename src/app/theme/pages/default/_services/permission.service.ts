import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams  } from "@angular/http";

import { User, Role } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class PermissionService {
    constructor(private http: Http) {
    }

    getAllPermissions() {
        return this.http.get(AppSettings.API_ENDPOINT + 'permissions', AppSettings.requestOptions()).map((response: Response) => response.json());
    }

    addPermissionToRole(permissions: any) {
        return this.http.post(AppSettings.API_ENDPOINT + 'RolepermissionDetails', permissions, AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    revokePermission(id: any) {
        return this.http.delete(AppSettings.API_ENDPOINT + 'RolepermissionDetails/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    getPermissionsByRole(id: any) {
        return this.http.get(AppSettings.API_ENDPOINT + 'roles/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    getMenus() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let params: URLSearchParams = new URLSearchParams();
        params.set('filter[include]', "permissions");
        let requestOptions = AppSettings.requestOptions();
        requestOptions.params = params;
        return this.http.get(AppSettings.API_ENDPOINT + 'roles/' + currentUser.roles[0].id + '/roleMenu', requestOptions).map((response: Response) => response.json());
    }
}
