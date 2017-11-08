import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Boards } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class BoardService {
  constructor(private http: Http) {
  }
  getAllBoards() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Boards', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }
}
