import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeesHeadComponent } from './fees-head.component';
import { FeesHeadListComponent } from './fees-head-list/fees-head-list.component';
import { FeesHeadAddEditComponent } from './fees-head-add-edit/fees-head-add-edit.component';
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { FeesService } from '../../../_services/fees.service';
import { FrequencyService } from '../../../_services/frequency.service';
import { CommonService } from '../../../_services/common.service';

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
        component: FeesHeadComponent,
        children: [
          {
            path: 'list',
            component: FeesHeadListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Feehead.Read']
            }
          },
          {
            path: 'add',
            component: FeesHeadAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Feehead.Create']
            }
          },
          {
            path: 'edit/:feeId',
            component: FeesHeadAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Feehead.Update']
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
    // primeng modules
    DataTableModule,
    SharedModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
  ], declarations: [
    FeesHeadComponent,
    FeesHeadListComponent,
    FeesHeadAddEditComponent,
  ],
  providers: [
    FeesService,
    FrequencyService,
    CommonService
  ],
})
export class FeesHeadModule {
}
