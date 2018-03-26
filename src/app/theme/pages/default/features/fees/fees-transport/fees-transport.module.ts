import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { TransportComponent } from './fees-transport.component';
import { TransportListComponent } from './fees-transport-list/fees-transport-list.component';
import { VerifyTransportListComponent } from './verify-fees-transport-list/verify-fees-transport-list.component';
import { TransportService, FrequencyService, AcademicYearService,SchoolService } from '../../../../default/_services/index';
import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
  ConfirmDialogModule,
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
        component: TransportComponent,
        children: [
          {
            path: 'list',
            component: TransportListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Zone.Read']
            }
          },
          {
            path: 'verifyList',
            component: VerifyTransportListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['VerifyTransport.Read']
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
    ReactiveFormsModule,
    // primeng modules
    SharedModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule,
    DialogModule
  ],
  declarations: [
    TransportComponent,
    TransportListComponent,
    VerifyTransportListComponent
  ],
  providers: [
    ConfirmationService,
    TransportService,
    FrequencyService, 
    AcademicYearService,
    SchoolService
  ]
})
export class TransportModule {
}
