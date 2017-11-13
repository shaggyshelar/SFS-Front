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

  getBoardById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'Boards/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createBoard(board: Boards) {
    return this.http.post(AppSettings.API_ENDPOINT +'Boards', board, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateBoard(board: Boards) {
    return this.http.patch(AppSettings.API_ENDPOINT +'Boards/' + board.id, board, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteBoard(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'Boards/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getBoardCount(url){
    return this.http.get(AppSettings.API_ENDPOINT + 'Boards/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());      
  }
  getAllBoardList(url) {   
    return this.http.get(AppSettings.API_ENDPOINT + 'Boards' + url, AppSettings.requestOptions()).map((response: Response) => response.json());  
   }
}
