import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';

import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { SchoolService } from '../../_services/index';
import { InstitutesService } from '../../_services/institute.service';
import { ImageUploadService } from '../../_services/imageUpload.service';
import { BoardService } from '../../_services/board.service';
import { SchoolComponent } from './school.component';
import { SchoolListComponent } from './school-list/school-list.component';
import { SchoolAddEditComponent } from './school-add-edit/school-add-edit.component';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
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
        component: SchoolComponent,
        children: [
          {
            path: 'list',
            component: SchoolListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['School.Read']
            }
          },
          {
            path: 'add',
            component: SchoolAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['School.Create']
            }
          },
          {
            path: 'edit/:schoolId',
            component: SchoolAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['School.Update']
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
    ConfirmDialogModule,
  ],
  declarations: [
    SchoolComponent,
    SchoolListComponent,
    SchoolAddEditComponent,
  ],
  providers: [
    SchoolService,
    InstitutesService,
    BoardService,
    ImageUploadService,
    ConfirmationService,
  ]
})
export class SchoolModule {
}
