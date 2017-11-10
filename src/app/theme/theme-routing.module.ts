import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
  {
    "path": "",
    "component": ThemeComponent,
    "canActivate": [AuthGuard],
    "children": [
      {
        "path": "features\/users",
        "loadChildren": ".\/pages\/default\/features\/users\/users.module#UsersModule"
      },
      {
        "path": "features\/roles",
        "loadChildren": ".\/pages\/default\/features\/roles\/roles.module#RolesModule"
      },
      {
        "path": "features\/student",
        "loadChildren": ".\/pages\/default\/features\/student\/student.module#StudentModule"
      },
      {
        "path": "features\/school",
        "loadChildren": ".\/pages\/default\/features\/school\/school.module#SchoolModule"
      },
      {
        "path": "features\/institute",
        "loadChildren": ".\/pages\/default\/features\/institute\/institute.module#InstituteModule"
      },
      {
        "path": "features\/class",
        "loadChildren": ".\/pages\/default\/features\/master_management\/class\/class.module#ClassModule"
      },
      {
        "path": "features\/division",
        "loadChildren": ".\/pages\/default\/features\/master_management\/division\/division.module#DivisionModule"
      },
      {
        "path": "features\/categories",
        "loadChildren": ".\/pages\/default\/features\/categories\/categories.module#CategoriesModule"
      },
      {
        "path": "features\/fees",
        "loadChildren": ".\/pages\/default\/features\/fees\/fees.module#FeesModule"
      },
      {
        "path": "features\/reports",
        "loadChildren": ".\/pages\/default\/features\/reports\/reports.module#ReportsModule"
      },
      // {
      //   "path": "features\/masterManagement",
      //   "loadChildren": ".\/pages\/default\/features\/master_management\/master_management.module#MasterManagementModule"
      // },
      {
        "path": "features\/configuration",
        "loadChildren": ".\/pages\/default\/features\/configuration\/configuration.module#ConfigurationModule"
      },
      {
        "path": "features\/archival",
        "loadChildren": ".\/pages\/default\/features\/archival\/archival.module#ArchivalModule"
      },
      {
        "path": "features\/feeProcessing",
        "loadChildren": ".\/pages\/default\/features\/fee_processing\/fee_processing.module#FeeProcessingModule"
      },
      {
        "path": "header/changePassword",
        "loadChildren": ".\/pages\/default\/features\/changePassword\/changePassword.module#ChangePasswordModule"
      },
      {
        "path": "features\/featureList",
        "loadChildren": ".\/pages\/default\/features\/feature\/feature.module#FeatureModule"
      },
      {
        "path": "index",
        "loadChildren": ".\/pages\/default\/index\/index.module#IndexModule"
      },
      {
        "path": "404",
        "loadChildren": ".\/pages\/default\/not-found\/not-found\/not-found.module#NotFoundModule"
      },
      {
        "path": "components\/fileUpload\/uploads",
        "loadChildren": ".\/pages\/default\/components\/fileUpload\/uploads\/uploads.module#UploadsComponentModule"
      },
      {
        "path": "",
        "redirectTo": "index",
        "pathMatch": "full"
      }
    ]
  },
  {
    "path": "changePassword",
    "canActivate": [AuthGuard],
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/changePassword\/changePassword.module#ChangePasswordModule"
  },
  {
    "path": "forbidden",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/unautherizedAccess\/unautherizedAccess.module#UnAutherizedAccessModule"
  },
  {
    "path": "selectSchool",
    "canActivate": [AuthGuard],
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/schoolDashboard\/schoolDashboard.module#SchoolDashboardModule"
  },
  {
    "path": "**",
    "redirectTo": "404",
    "pathMatch": "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
