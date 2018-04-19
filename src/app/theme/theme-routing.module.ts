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
        "loadChildren": ".\/pages\/default\/features/\master_management/institute\/institute.module#InstituteModule"
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
        "path": "features\/invoice",
        "loadChildren": ".\/pages\/default\/features\/invoice\/invoice.module#InvoiceModule"
      },
      {
        "path": "features\/masterManagement\/categories",
        "loadChildren": ".\/pages\/default\/features\/master_management\/categories\/categories.module#CategoriesModule"
      },
      {
        "path": "features\/masterManagement\/frequencies",
        "loadChildren": ".\/pages\/default\/features\/master_management\/frequency\/frequency.module#FrequencyModule"

      },
      {
        "path": "features\/merchant",
        "loadChildren": ".\/pages\/default\/features\/merchant\/merchant.module#MerchantModule"
      },
      {
        "path": "features\/fees\/feesHead",
        "loadChildren": ".\/pages\/default\/features\/fees\/fees-head\/fees-head.module#FeesHeadModule"
      },
      {
        "path": "features\/fees\/feesPlan",
        "loadChildren": ".\/pages\/default\/features\/fees\/fees-plan\/fees-plan.module#FeesPlanModule"
      },
      {
        "path": "reports\/invoice",
        "loadChildren": ".\/pages\/default\/features\/reports\/reports.module#ReportsModule"
      },
      {
        "path": "features\/reports\/studentReports",
        "loadChildren": ".\/pages\/default\/features\/reports\/reports.module#ReportsModule"
      },
      {
        "path": "features\/reports\/studentCategoryReports",
        "loadChildren": ".\/pages\/default\/features\/reports\/reports.module#ReportsModule"
      },
      {
        "path": "features\/reports\/feeheadPaymentReports",
        "loadChildren": ".\/pages\/default\/features\/reports\/reports.module#ReportsModule"
      },
      {
        "path": "features\/reports\/classCategoryPaymentReports",
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
        "path": "features\/sfsconfiguration",
        "loadChildren": ".\/pages\/default\/features\/sfs_configuration\/sfsconfiguration.module#SFSConfigurationModule"
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
        "path": "features\/board",
        "loadChildren": ".\/pages\/default\/features\/master_management\/board\/board.module#BoardModule"
      },
      {
        "path": "features\/academicYear",
        "loadChildren": ".\/pages\/default\/features\/master_management\/academic_year\/academic-year.module#AcademicYearModule"
      },
      {
        "path": "features\/feePlanAssociation",
        "loadChildren": ".\/pages\/default\/features\/fees\/fee-plan-association\/fee-plan-association.module#FeePlanAssociationModule"
      },
      {
        "path": "features\/adhocFee",
        "loadChildren": ".\/pages\/default\/features\/fees\/fee-adhoc\/fee-adhoc.module#AdhocFeeModule"
      },
      {
        "path": "features\/transport",
        "loadChildren": ".\/pages\/default\/features\/fees\/fees-transport\/fees-transport.module#TransportModule"
      },
      {
        "path": "features\/audit",
        "loadChildren": ".\/pages\/default\/features\/audit_trail\/audit.module#AuditModule"
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
