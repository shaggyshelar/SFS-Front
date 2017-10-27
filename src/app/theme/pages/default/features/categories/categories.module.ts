import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesAddEditComponent } from './categories-add-edit/categories-add-edit.component';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { CategoriesService } from '../../_services/index';

import {
DataTableModule,
SharedModule,
ButtonModule,
DropdownModule
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: CategoriesComponent,
        children: [
          { path: 'list', component: CategoriesListComponent },
          { path: 'add', component: CategoriesAddEditComponent },
          { path: 'edit/:categoriesId', component: CategoriesAddEditComponent },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    // primeng modules
    DataTableModule,
    SharedModule,
    ButtonModule,
    DropdownModule
  ], declarations: [
    CategoriesComponent,
    CategoriesListComponent,
    CategoriesAddEditComponent,
  ],
  providers: [
    CategoriesService,
  ],
})
export class CategoriesModule {
}
