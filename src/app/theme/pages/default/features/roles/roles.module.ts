import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";

import { RoleService, FeatureService, PermissionService,SchoolService } from '../../_services/index';
import { RolesComponent } from './roles.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleAddEditComponent } from './role-add-edit/role-add-edit.component';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  AutoCompleteModule,
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
        component: RolesComponent,
        children: [
          {
            path: 'list',
            component: RoleListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Role.Read']
            }
          },
          {
            path: 'add',
            component: RoleAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Role.Create']
            }
          },
          {
            path: 'edit/:roleId',
            component: RoleAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Role.Update']
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
    AutoCompleteModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  declarations: [
    RolesComponent,
    RoleListComponent,
    RoleAddEditComponent,
  ],
  providers: [
    RoleService,
    FeatureService,
    PermissionService,
    SchoolService,
    ConfirmationService
  ],
})
export class RolesModule {
}
