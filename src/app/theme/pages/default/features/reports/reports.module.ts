import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { StudentInvoiceReportComponent } from './student-invoice-report/student-invoice-report.component';
import { StudentCategoryReportComponent } from './student-category-report/student-category-report.component';
import { InvoiceService } from '../../../default/_services/invoice.service';
import { ClassService } from '../../_services/class.service';
import { FormatService } from '../../_services/tableToXls/format.service';
import { DataGridUtil } from '../../_services/tableToXls/datagrid.util';
import { StudentService } from '../../_services/index';
import { CategoriesService } from '../../_services/index';
import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
  ConfirmDialogModule,
  CalendarModule,
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
          {
            path: 'category',
            component: StudentCategoryReportComponent,
            canActivate: [AuthGuard],
            data: {
              //permissions: ['Student.Read']
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
    CalendarModule
  ], declarations: [
    ReportsComponent,
    StudentInvoiceReportComponent,
    StudentCategoryReportComponent
  ],
  providers: [
    ConfirmationService,
    InvoiceService,
    ClassService,
    FormatService, DataGridUtil,
    StudentService,
    CategoriesService,
  ]
})
export class ReportsModule {
}
