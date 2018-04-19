import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { MerchantComponent } from './merchant.component';
import { MerchantListComponent } from './merchant-list/merchant-list.component';
import { UserSchoolDetailsService } from '../../../default/_services/userschooldetails.service';
import { MerchantService } from '../../../default/_services/merchant.service';
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
        component: MerchantComponent,
        children: [
          {
            path: 'list',
            component: MerchantListComponent,
            canActivate: [AuthGuard],
            data: {
              //permissions: ['Student.Read']
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
    SharedModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule,
  ],
  declarations: [
    MerchantComponent,
    MerchantListComponent,
  ],
  providers: [
    ConfirmationService,
    UserSchoolDetailsService,
    MerchantService
  ]
})
export class MerchantModule {
}
