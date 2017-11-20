import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";

import { CategoriesComponent } from './categories.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesAddEditComponent } from './categories-add-edit/categories-add-edit.component';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { CategoriesService } from '../../../_services/index';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
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
          {
            path: 'list',
            component: CategoriesListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Category.Read']
            }
          },
          {
            path: 'add',
            component: CategoriesAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Category.Create']
            }
          },
          {
            path: 'edit/:categoriesId',
            component: CategoriesAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Category.Update']
            }
          },
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
    DropdownModule,
    ConfirmDialogModule
  ], declarations: [
    CategoriesComponent,
    CategoriesListComponent,
    CategoriesAddEditComponent,
  ],
  providers: [
    CategoriesService,
    ConfirmationService
  ],
})
export class CategoriesModule {
}
