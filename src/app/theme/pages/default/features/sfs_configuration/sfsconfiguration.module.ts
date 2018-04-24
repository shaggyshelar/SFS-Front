import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { SFSConfigurationComponent } from './sfsconfiguration.component';
import { SFSConfigurationListComponent } from './sfsconfiguration-list/sfsconfiguration-list.component';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { CommonService } from '../../_services/index';
import { ConfigurationService } from '../../_services/configuration.service';

import {
  DataTableModule,
  SharedModule,
  ConfirmationService
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: SFSConfigurationComponent,
        children: [
          {
            path: 'list',
            component: SFSConfigurationListComponent,
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
    DataTableModule,
    SharedModule,
  ], declarations: [
    SFSConfigurationComponent,
    SFSConfigurationListComponent
  ],
  providers: [
    ConfirmationService,
    CommonService,
    ConfigurationService
  ]
})
export class SFSConfigurationModule {
}
