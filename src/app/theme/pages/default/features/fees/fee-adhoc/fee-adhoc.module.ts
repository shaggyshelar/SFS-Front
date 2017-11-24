import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { AdhocFeeService, CommonService } from '../../../_services/index';
import { AdhocFeeComponent } from './fee-adhoc.component';
import { AdhocFeeListComponent } from './fee-adhoc-list/fee-adhoc-list.component';
import { AdhocFeeAddEditComponent } from './fee-adhoc-add-edit/fee-adhoc-add-edit.component';

import {
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
  CalendarModule,
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: AdhocFeeComponent,
        children: [
          {
            path: 'list',
            component: AdhocFeeListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Adhocfee.Read']
            }
          },
          {
            path: 'add',
            component: AdhocFeeAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Adhocfee.Create']
            }
          },
          {
            path: 'edit/:id',
            component: AdhocFeeAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Adhocfee.Update']
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
    HttpModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    ConfirmDialogModule
  ],
  declarations: [
    AdhocFeeComponent,
    AdhocFeeListComponent,
    AdhocFeeAddEditComponent,
  ],
  providers: [
    AdhocFeeService,
    ConfirmationService,
    CommonService,
  ],
})
export class AdhocFeeModule {
}
