import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';

import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { InstitutesService } from '../../_services/institute.service';
import { InstituteComponent } from './institute.component';
import { InstitutesListComponent } from './institutes-list/institutes-list.component';
import { InstituteAddEditComponent } from './institutes-add-edit/institutes-add-edit.component';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: InstituteComponent,
        children: [
          {
            path: 'list',
            component: InstitutesListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Institute.Read']
            }
          },
          {
            path: 'add',
            component:InstituteAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Institute.Create']
            }
          },
          {
            path: 'edit/:instituteId',
            component: InstituteAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Institute.Update']
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
  ],
  declarations: [
    InstituteComponent,
    InstitutesListComponent,
    InstituteAddEditComponent
  ],
  providers: [
    InstitutesService,
  ]
})
export class InstituteModule {
}
