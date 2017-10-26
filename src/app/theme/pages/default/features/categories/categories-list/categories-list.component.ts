import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: "app-users-list",
  templateUrl: "./categories-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CategoriesListComponent implements OnInit {
  categoriesList : any; 
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.categoriesList = [{
      ID: 1,
      CategoryId: "1",
      SchoolId: '11',
      CategoryName: 'school',
      CategoryDescription: 'Category Description'
    },
    {
      ID: 2,
      CategoryId: "2",
      SchoolId: '12',
      CategoryName: 'school',
      CategoryDescription: 'Category Description'
    },
    {
      ID: 3,
      CategoryId: "3",
      SchoolId: '13',
      CategoryName: 'school',
      CategoryDescription: 'Category Description'
    },
    {
      ID: 4,
      CategoryId: "4",
      SchoolId: '14',
      CategoryName: 'school',
      CategoryDescription: 'Category Description'
    },
    {
      ID: 5,
      CategoryId: "5",
      SchoolId: '15',
      CategoryName: 'school',
      CategoryDescription: 'Category Description'
    }];
  }

  onAddCategory() {
    this.router.navigate(['/features/categories/add']);
  }

  onManageCategoryClick(data: any) {
    debugger;
    this.router.navigate(['/features/categories/edit', data.ID]);
  }
  onCategoryDeleteClick(data: any) {
    debugger;
    //this.router.navigate(['/features/categories/edit', data.ID]);
    alert('Deleted the record having ID : '+ data.ID);
  }
  
}
