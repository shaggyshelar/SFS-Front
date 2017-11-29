import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { FeePlanAssociationService, ClassService, AcademicYearService, CategoriesService } from '../../../_services/index';
import { FeePlanAssociationComponent } from './fee-plan-association.component';
import { FeePlanAssociationListComponent } from './fee-plan-association-list/fee-plan-association-list.component';
import { FeePlanAssociationAddEditComponent } from './fee-plan-association-add-edit/fee-plan-association-add-edit.component';

import {
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
        component: FeePlanAssociationComponent,
        children: [
          {
            path: 'list',
            component: FeePlanAssociationListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Feeplanassociation.Read']
            }
          },
          {
            path: 'add',
            component: FeePlanAssociationAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Feeplanassociation.Create']
            }
          },
          {
            path: 'edit/:id',
            component: FeePlanAssociationAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Feeplanassociation.Update']
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
    HttpModule,
    ReactiveFormsModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  declarations: [
    FeePlanAssociationComponent,
    FeePlanAssociationListComponent,
    FeePlanAssociationAddEditComponent,
  ],
  providers: [
    FeePlanAssociationService,
    ConfirmationService,
    ClassService,
    CategoriesService,
    AcademicYearService
  ],
})
export class FeePlanAssociationModule {
}
