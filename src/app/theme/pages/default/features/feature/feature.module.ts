import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeatureListComponent } from './feature-list.component';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { FeatureService } from '../../_services/index';

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
        component: FeatureListComponent,
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
    LayoutModule,
    // primeng modules
    DataTableModule,
    SharedModule,
  ], 
  declarations: [
      FeatureListComponent,
  ],
  providers: [
    FeatureService,
  ],
})
export class FeatureModule {
}
