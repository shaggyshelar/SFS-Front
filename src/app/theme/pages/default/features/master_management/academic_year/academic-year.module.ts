import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { AcademicYearService  } from '../../../_services/index';
import { AcademicYearComponent } from './academic-year.component';
import { AcademicYearListComponent } from './academic-year-list/academic-year-list.component';
import { AcademicYearAddEditComponent } from './academic-year-add-edit/academic-year-add-edit.component';

import {
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
        component: AcademicYearComponent,
        children: [
          {
            path: 'list',
            component: AcademicYearListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['AcademicYear.Read']
            }
          },
          {
            path: 'add',
            component: AcademicYearAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['AcademicYear.Create']
            }
          },
          {
            path: 'edit/:id',
            component: AcademicYearAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['AcademicYear.Update']
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
    CalendarModule,
    ConfirmDialogModule,    
  ],
  declarations: [
    AcademicYearComponent,
    AcademicYearListComponent,
    AcademicYearAddEditComponent,
  ],
  providers: [
    AcademicYearService,
    ConfirmationService
  ],
})
export class AcademicYearModule {
}
