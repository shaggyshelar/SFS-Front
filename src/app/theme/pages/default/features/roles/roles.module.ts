import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';

import { RoleService, FeatureService ,PermissionService } from '../../_services/index';
import { RolesComponent } from './roles.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleAddEditComponent } from './role-add-edit/role-add-edit.component';

import {
DataTableModule,
SharedModule,
ButtonModule,
AutoCompleteModule,
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
          { path: 'list', component: RoleListComponent },
          { path: 'add', component: RoleAddEditComponent },
          { path: 'edit/:roleId', component: RoleAddEditComponent },
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
  ],
})
export class RolesModule {
}
