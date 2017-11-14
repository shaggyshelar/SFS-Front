import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Categories } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class ImageUploadService {
  constructor(private http: Http) {
  }

  createFolder(data) {
    return this.http.post(AppSettings.API_ENDPOINT + 'containers', data, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  uploadImage(id,image) {
    let reqObj = AppSettings.requestOptions();
    reqObj.headers["_headers"].delete("content-type");
    return this.http.post(AppSettings.API_ENDPOINT + 'containers/' + id + '/upload',image, reqObj).map((response: Response) => response.json());
  }

  getImageUrl(){
    let reqObj = AppSettings.requestOptions();
    debugger;
    reqObj.headers["_headers"].delete("content-type");
    return AppSettings.API_ENDPOINT + "/containers/"+localStorage.getItem("schoolId")+"/download/"+localStorage.getItem("schoolLogo");
  }

}
