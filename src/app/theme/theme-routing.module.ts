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
      {
        "path": "features\/masterManagement",
        "loadChildren": ".\/pages\/default\/features\/master_management\/master_management.module#MasterManagementModule"
      },
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
        "path": "angular\/ng-bootstrap",
        "loadChildren": ".\/pages\/default\/angular\/ng-bootstrap\/ng-bootstrap.module#NgBootstrapModule"
      },
      {
        "path": "angular\/primeng",
        "loadChildren": ".\/pages\/default\/angular\/primeng\/primeng.module#PrimengModule"
      },
      {
        "path": "index",
        "loadChildren": ".\/pages\/default\/index\/index.module#IndexModule"
      },
      {
        "path": "components\/utils\/idle-timer",
        "loadChildren": ".\/pages\/default\/components\/utils\/utils-idle-timer\/utils-idle-timer.module#UtilsIdleTimerModule"
      },
      {
        "path": "components\/utils\/session-timeout",
        "loadChildren": ".\/pages\/default\/components\/utils\/utils-session-timeout\/utils-session-timeout.module#UtilsSessionTimeoutModule"
      },
      {
        "path": "header\/actions",
        "loadChildren": ".\/pages\/default\/header\/header-actions\/header-actions.module#HeaderActionsModule"
      },
      {
        "path": "header\/profile",
        "loadChildren": ".\/pages\/default\/header\/header-profile\/header-profile.module#HeaderProfileModule"
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
    "path": "snippets\/pages\/user\/login-1",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/user\/user-login-1\/user-login-1.module#UserLogin1Module"
  },
  {
    "path": "snippets\/pages\/user\/login-2",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/user\/user-login-2\/user-login-2.module#UserLogin2Module"
  },
  {
    "path": "snippets\/pages\/user\/login-3",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/user\/user-login-3\/user-login-3.module#UserLogin3Module"
  },
  {
    "path": "snippets\/pages\/user\/login-4",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/user\/user-login-4\/user-login-4.module#UserLogin4Module"
  },
  {
    "path": "snippets\/pages\/user\/login-5",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/user\/user-login-5\/user-login-5.module#UserLogin5Module"
  },
  {
    "path": "snippets\/pages\/errors\/error-1",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/errors\/errors-error-1\/errors-error-1.module#ErrorsError1Module"
  },
  {
    "path": "snippets\/pages\/errors\/error-2",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/errors\/errors-error-2\/errors-error-2.module#ErrorsError2Module"
  },
  {
    "path": "snippets\/pages\/errors\/error-3",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/errors\/errors-error-3\/errors-error-3.module#ErrorsError3Module"
  },
  {
    "path": "snippets\/pages\/errors\/error-4",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/errors\/errors-error-4\/errors-error-4.module#ErrorsError4Module"
  },
  {
    "path": "snippets\/pages\/errors\/error-5",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/errors\/errors-error-5\/errors-error-5.module#ErrorsError5Module"
  },
  {
    "path": "snippets\/pages\/errors\/error-6",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/errors\/errors-error-6\/errors-error-6.module#ErrorsError6Module"
  },
   {
    "path": "changePassword",
    "canActivate": [AuthGuard],
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/changePassword\/changePassword.module#ChangePasswordModule"
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
