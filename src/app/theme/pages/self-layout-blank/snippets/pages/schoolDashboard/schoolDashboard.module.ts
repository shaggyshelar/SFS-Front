import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserSchoolDetailsService } from '../../../../default/_services/userschooldetails.service';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { SchoolDashboardComponent } from './schoolDashboard.component';
import { UserService } from '../../../../default/_services/index';

import {
GrowlModule,
} from 'primeng/primeng';

const routes: Routes = [
    {
        "path": "",
        "component": SchoolDashboardComponent
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes),
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        GrowlModule,
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        SchoolDashboardComponent
    ],
    providers: [
        UserSchoolDetailsService
    ],
})
export class SchoolDashboardModule {

}
