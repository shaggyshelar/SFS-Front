import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';

import { StudentService } from '../../_services/index';
import { CommonService } from '../../_services/index';
import { StudentComponent } from './student.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentAddEditComponent } from './student-add-edit/student-add-edit.component';

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
        component: StudentComponent,
        children: [
          { path: 'list', component: StudentListComponent },
          { path: 'edit/:studentId', component: StudentAddEditComponent },
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
    StudentComponent,
    StudentListComponent,
    StudentAddEditComponent,
  ],
  providers: [
    StudentService,
    CommonService
  ]
})
export class StudentModule {
}
