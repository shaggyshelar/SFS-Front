import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';

import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { DivisionService } from '../../../_services/division.service';
import { ClassService } from '../../../_services/class.service';
import { DivisionComponent } from './division.component';
import { DivisionListComponent } from './division-list/division-list.component';
import { DivisionAddEditComponent } from './division-add-edit/division-add-edit.component';

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
        component: DivisionComponent,
        children: [
          {
            path: 'list',
            component: DivisionListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Division.Read']
            }
          },
          {
            path: 'add',
            component:DivisionAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Division.Create']
            }
          },
          {
            path: 'edit/:divisionId',
            component: DivisionAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Division.Update']
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
    DivisionComponent,
    DivisionListComponent,
    DivisionAddEditComponent
  ],
  providers: [
    DivisionService,
    ClassService,
  ]
})
export class DivisionModule {
}
