import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationListComponent } from './configuration-list/configuration-list.component';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { CommonService } from '../../_services/index';
import { ConfigurationService } from '../../_services/configuration.service';
import { UserSchoolDetailsService } from '../../../default/_services/userschooldetails.service';

import {
  DataTableModule,
  SharedModule,
  ConfirmationService,
  DropdownModule
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: ConfigurationComponent,
        children: [
          {
            path: 'list',
            component: ConfigurationListComponent,
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
    DropdownModule
  ], declarations: [
    ConfigurationComponent,
    ConfigurationListComponent
  ],
  providers: [
    ConfirmationService,
    CommonService,
    ConfigurationService,
    UserSchoolDetailsService
  ]
})
export class ConfigurationModule {
}
