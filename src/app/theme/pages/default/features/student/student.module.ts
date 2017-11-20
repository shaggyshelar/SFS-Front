import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { StudentService } from '../../_services/index';
import { ClassService } from '../../_services/index';
import { CommonService } from '../../_services/index';
import { AcademicYearService } from '../../_services/index';
import { CategoriesService } from '../../_services/index';
import { StudentComponent } from './student.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentAddEditComponent } from './student-add-edit/student-add-edit.component';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
  CalendarModule,
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
        component: StudentComponent,
        children: [
          {
            path: 'list',
            component: StudentListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Student.Read']
            }
          },
          {
            path: 'edit/:studentId',
            component: StudentAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Student.Read']
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
    CalendarModule,
    ConfirmDialogModule,
  ],
  declarations: [
    StudentComponent,
    StudentListComponent,
    StudentAddEditComponent,
  ],
  providers: [
    StudentService,
    CommonService,
    ClassService,
    ConfirmationService,
    AcademicYearService,
    CategoriesService,
  ]
})
export class StudentModule {
}
