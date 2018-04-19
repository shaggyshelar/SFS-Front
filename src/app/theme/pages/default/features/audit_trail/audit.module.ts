import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuditComponent } from './audit.component';
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { InvoiceService } from '../../../default/_services/invoice.service';
import { ClassService } from '../../_services/class.service';
import { FormatService } from '../../_services/tableToXls/format.service';
import { DataGridUtil } from '../../_services/tableToXls/datagrid.util';
import { CommonService } from '../../_services/index';
import { AuditTrailComponent } from './audit_trail.component';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
  ConfirmDialogModule,
  CalendarModule,
  ConfirmationService,
  DialogModule
} from 'primeng/primeng';


const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: AuditComponent,
        children: [
          {
            path: 'trail',
            component: AuditTrailComponent,
           // canActivate: [AuthGuard],
            data: {
              //permissions: ['Audit.Read']
            }
          }
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
    SharedModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule,
    DialogModule,
    CalendarModule
  ], declarations: [
    AuditComponent,
    AuditTrailComponent
  ],
  providers: [
    ConfirmationService,
    InvoiceService,
    ClassService,
    FormatService, DataGridUtil,
    CommonService,
  ]
})
export class AuditModule {
}
