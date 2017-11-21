import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeesComponent } from './fees.component';
import { FeesPlanComponent } from './fees-plan/fees-plan.component';
import { TransportComponent } from './transport/transport.component';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { FeesService } from '../../_services/index';

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
        component: FeesComponent,
        children: [
          { path: 'plan', component: FeesPlanComponent },
          { path: 'transport', component: TransportComponent },
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
    // primeng modules
    DataTableModule,
    SharedModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
  ], declarations: [
    FeesComponent,
    FeesPlanComponent,
    TransportComponent,
  ],
  providers: [
    FeesService,
  ]
})
export class FeesModule {
}
