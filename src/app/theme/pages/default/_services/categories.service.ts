import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Categories } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class CategoriesService {
  constructor(private http: Http) {
  }

  getAllCategories() {
   return this.http.get(AppSettings.API_ENDPOINT + 'categories', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getCategoryById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT +'categories/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createCategory(categories: Categories) {
    return this.http.post(AppSettings.API_ENDPOINT +'categories', categories, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateCategory(categories: Categories) {
    return this.http.put(AppSettings.API_ENDPOINT +'categories/' + categories.id, categories, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteCategory(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT +'categories/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
