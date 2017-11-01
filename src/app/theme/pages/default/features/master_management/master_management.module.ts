import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MasterManagementComponent } from './master_management.component';
import { AcademicYearComponent } from './academic_year/academic_year.component';
import { BoardComponent } from './board/board.component';
import { ClassComponent } from './class/class.component';
import { PaymentFrequencyComponent } from './payment_frequency/payment_frequency.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoriesAddEditComponent } from './categories-add-edit/categories-add-edit.component';

import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { CategoriesService } from '../../_services/index';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: MasterManagementComponent,
        children: [
          { path: 'academicYear', component: AcademicYearComponent },
          { path: 'board', component: BoardComponent },
          { path: 'class', component: ClassComponent },
          { path: 'paymentFrequency', component: PaymentFrequencyComponent },
          { path: 'categories', component: CategoriesComponent },
          { path: 'categories/add', component: CategoriesAddEditComponent },
          { path: 'categories/edit/:categoriesId', component: CategoriesAddEditComponent },
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
    MasterManagementComponent,
    AcademicYearComponent,
    BoardComponent,
    ClassComponent,
    PaymentFrequencyComponent,
    CategoriesComponent,
    CategoriesAddEditComponent
  ],
   providers: [
    CategoriesService,
  ],
})
export class MasterManagementModule {
}
