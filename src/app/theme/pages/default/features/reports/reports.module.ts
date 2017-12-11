import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { StudentInvoiceReportComponent } from './student-invoice-report/student-invoice-report.component';
import { InvoiceService } from '../../../default/_services/invoice.service'
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
        component: ReportsComponent,
        children: [
          {
            path: 'student',
            component: StudentInvoiceReportComponent,
            canActivate: [AuthGuard],
            data: {
              //permissions: ['Student.Read']
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
    SharedModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule,
  ], declarations: [
    ReportsComponent,
    StudentInvoiceReportComponent
  ],
  providers: [
    ConfirmationService,
   InvoiceService
  ]
})
export class ReportsModule {
}
