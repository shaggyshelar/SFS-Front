import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams  } from "@angular/http";

import { User, Role } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class PermissionService {
    constructor(private http: Http) {
    }

    // getAllPermission(): Observable<any> {
    //     return this.getList$(0,0,true).map(res => res.json());
    // }
    // getPermissionsByRole(roleId:any): Observable<any> {
    //     return this.get$(roleId,true).map(res => res.json());
    // }
    // addPermissionToRole(permission:any): Observable<any> {
    //     return this.post$(permission,true).map(res => res.json());
    // }
    // revokePermission(permission:any): Observable<any> {
    //     return this.put$(permission.ID,permission,true);
    // }

    getAllPermissions() {
        return this.http.get(AppSettings.API_ENDPOINT + 'permissions', AppSettings.requestOptions()).map((response: Response) => response.json());
    }

    addPermissionToRole(permissions: any) {
        return this.http.post(AppSettings.API_ENDPOINT + 'permissions', permissions , AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    revokePermission(id:any) {
        return this.http.delete(AppSettings.API_ENDPOINT +'permissions/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
    }
    getPermissionsByRole(id: any) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let params: URLSearchParams = new URLSearchParams();
        params.set('access_token', currentUser.token);
      //  params.set('filter[include]', "permissions");
        let requestOptions = AppSettings.requestOptions();
        requestOptions.params = params;
        return this.http.get(AppSettings.API_ENDPOINT +'roles/' + id, requestOptions ).map((response: Response) => response.json());
    }
    getMenus() {
       // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let params: URLSearchParams = new URLSearchParams();
        // params.set('access_token', currentUser.token);
        params.set('filter[include]', "permissions");
        let requestOptions = AppSettings.requestOptions();
        requestOptions.params = params;
        return this.http.get(AppSettings.API_ENDPOINT +'menus/', requestOptions ).map((response: Response) => response.json());
    }
}
