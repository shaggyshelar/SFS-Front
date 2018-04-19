import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeeProcessingComponent } from './fee_processing.component';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';

import {
DataTableModule,
SharedModule,
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: FeeProcessingComponent,
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
    LayoutModule,
    FormsModule,
    // primeng modules
    DataTableModule,
    SharedModule,
  ], declarations: [
    FeeProcessingComponent,
  ]
})
export class FeeProcessingModule {
}
