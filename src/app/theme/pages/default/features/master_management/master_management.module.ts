import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MasterManagementComponent } from './master_management.component';
import { ClassComponent } from './class/class.component';

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
          { path: 'class', component: ClassComponent },
          //{ path: 'paymentFrequency', component: PaymentFrequencyComponent },
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
    ClassComponent,
   // PaymentFrequencyComponent,
  ],
   providers: [
    CategoriesService,
  ],
})
export class MasterManagementModule {
}
