import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Categories } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class CategoriesService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllCategories() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Schoolcategories', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllCategoriesList(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Schoolcategories' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getCategoryById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Schoolcategories/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createCategory(categories: Categories) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Schoolcategories/', categories, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateCategory(categories: Categories) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Schoolcategories/' + categories.id, categories, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteCategory(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'categories/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getCategoryCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Schoolcategories/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
