import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { TransportComponent } from './fees-transport.component';
import { TransportListComponent } from './fees-transport-list/fees-transport-list.component';
import { TransportService, FrequencyService, AcademicYearService } from '../../../../default/_services/index';
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
  ],
  declarations: [
    TransportComponent,
    TransportListComponent,
  ],
  providers: [
    ConfirmationService,
    TransportService,
    FrequencyService, 
    AcademicYearService
  ]
})
export class TransportModule {
}
