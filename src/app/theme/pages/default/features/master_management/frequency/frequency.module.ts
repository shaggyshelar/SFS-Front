import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';

import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { FrequencyService } from '../../../_services/frequency.service';
import { FrequencyComponent } from './frequency.component';
import { FrequenciesListComponent } from './frequency-list/frequency-list.component';
import { FrequenciesAddEditComponent } from './frequency-add-edit/frequency-add-edit.component';

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
        component: FrequencyComponent,
        children: [
          {
            path: 'list',
            component: FrequenciesListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Frequency.Read']
            }
          },
          {
            path: 'add',
            component:FrequenciesAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Frequency.Create']
            }
          },
          {
            path: 'edit/:frequencyId',
            component: FrequenciesAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Frequency.Update']
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
    DataTableModule,
    SharedModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  declarations: [
    FrequencyComponent,
    FrequenciesListComponent,
    FrequenciesAddEditComponent
  ],
  providers: [
    FrequencyService,
    ConfirmationService
  ]
})
export class FrequencyModule {
}
