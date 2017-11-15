import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../../default.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { ClassService } from '../../../_services/class.service';
import { ClassComponent } from './class.component';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassAddEditComponent } from './class-add-edit/class-add-edit.component';

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
        component: ClassComponent,
        children: [
          {
            path: 'list',
            component: ClassListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Class.Read']
            }
          },
          {
            path: 'add',
            component: ClassAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Class.Create']
            }
          },
          {
            path: 'edit/:classId',
            component: ClassAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['Class.Update']
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
    ClassComponent,
    ClassListComponent,
    ClassAddEditComponent
  ],
  providers: [
    ClassService,
    ConfirmationService,
  ]
})
export class ClassModule {
}
