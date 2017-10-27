import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeesComponent } from './fees.component';
import { FeesListComponent } from './fees-list/fees-list.component';
import { FeesAddEditComponent } from './fees-add-edit/fees-add-edit.component';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { FeesService } from '../../_services/index';
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
        component: FeesComponent,
        children: [
          { path: 'list', component: FeesListComponent },
          { path: 'add', component: FeesAddEditComponent },
          { path: 'edit/:feeId', component: FeesAddEditComponent },
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
    // primeng modules
    DataTableModule,
    SharedModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
  ], declarations: [
    FeesComponent,
    FeesListComponent,
    FeesAddEditComponent,
  ],
  providers: [
    FeesService,
  ]
})
export class FeesModule {
}
