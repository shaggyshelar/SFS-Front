import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeesPlanAddEditComponent } from './fees-plan-add-edit/fees-plan-add-edit.component';
import { FeesPlanListComponent } from './fees-plan-list/fees-plan-list.component';
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { FeesService } from '../../../_services/fees.service';
import { FrequencyService } from '../../../_services/frequency.service';
import { CommonService } from '../../../_services/common.service';
import { FeesPlanComponent } from '../fees-plan/fees-plan.component';
import { AcademicYearService, SchoolService } from '../../../_services/index';
import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
  CalendarModule
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: FeesPlanComponent,
        children: [
          {
            path: 'list',
            component: FeesPlanListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Feeplan.Read']
            }
          },
          {
            path: 'add',
            component: FeesPlanAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Feeplan.Create']
            }
          },
          {
            path: 'edit/:feeId',
            component: FeesPlanAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Feeplan.Update']
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
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule,
    CalendarModule
  ], declarations: [
    FeesPlanComponent,
    FeesPlanListComponent,
    FeesPlanAddEditComponent,
  ],
  providers: [
    FeesService,
    FrequencyService,
    CommonService,
    ConfirmationService,
    AcademicYearService,
    SchoolService
  ],
})
export class FeesPlanModule {
}
