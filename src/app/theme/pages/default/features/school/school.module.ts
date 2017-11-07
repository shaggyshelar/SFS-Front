import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';

import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { SchoolService } from '../../_services/index';
import { SchoolComponent } from './school.component';
import { SchoolListComponent } from './school-list/school-list.component';
import { SchoolAddEditComponent } from './school-add-edit/school-add-edit.component';
import { InstitutesComponent } from './institutes/institutes.component';


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
        component: SchoolComponent,
        children: [
          { 
            path: 'list', 
            component: SchoolListComponent
            //canActivate: [AuthGuard],
            //data: {
              //permissions: ['user.Read']
            //}
          },
          { path: 'add', component: SchoolAddEditComponent },
          { path: 'edit/:schoolId', component: SchoolAddEditComponent },
          { path: 'institutes', component: InstitutesComponent },
          
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
    SchoolComponent,
    SchoolListComponent,
    SchoolAddEditComponent,
    InstitutesComponent,
  ],
  providers: [
    SchoolService,
  ]
})
export class SchoolModule {
}
