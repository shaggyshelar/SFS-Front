import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './../../default.component';
import { LayoutModule } from './../../../../layouts/layout.module';

import { AuthGuard } from "./../../../../../auth/_guards/auth.guard";


import { InvoiceComponent  } from './invoice.component';
import { InvoiceListComponent  } from './invoice-list/invoice-list.component';
import { InvoiceSummaryComponent  } from './invoice-summary/invoice-summary.component';

import {
  DropdownModule,
  CalendarModule,
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
        component: InvoiceComponent,
        children: [
          {
            path: 'list',
            component: InvoiceListComponent,
            canActivate: [AuthGuard],
            // data: {
            //   permissions: ['AcademicYear.Read']
            // }
          },
          {
            path: 'summary',
            component: InvoiceSummaryComponent,
            canActivate: [AuthGuard],
            // data: {
            //   permissions: ['AcademicYear.Create']
            // }
          },
          // {
          //   path: 'edit/:id',
          //   component: AcademicYearAddEditComponent,
          //   canActivate: [AuthGuard],
          //   data: {
          //     permissions: ['AcademicYear.Update']
          //   }
          // },
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
    ConfirmDialogModule,    
  ],
  declarations: [
    InvoiceComponent,
    InvoiceListComponent,
    InvoiceSummaryComponent,
  ],
  providers: [
    ConfirmationService
  ],
})
export class InvoiceModule {
}
