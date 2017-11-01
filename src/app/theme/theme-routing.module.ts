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
        "path": "components\/datatables\/base\/data-local",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-data-local\/base-data-local.module#BaseDataLocalModule"
      },
      {
        "path": "components\/datatables\/base\/data-json",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-data-json\/base-data-json.module#BaseDataJsonModule"
      },
      {
        "path": "components\/datatables\/base\/data-ajax",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-data-ajax\/base-data-ajax.module#BaseDataAjaxModule"
      },
      {
        "path": "components\/datatables\/base\/record-selection",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-record-selection\/base-record-selection.module#BaseRecordSelectionModule"
      },
      {
        "path": "components\/datatables\/base\/column-rendering",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-column-rendering\/base-column-rendering.module#BaseColumnRenderingModule"
      },
      {
        "path": "components\/datatables\/base\/column-width",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-column-width\/base-column-width.module#BaseColumnWidthModule"
      },
      {
        "path": "components\/datatables\/base\/responsive-columns",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-responsive-columns\/base-responsive-columns.module#BaseResponsiveColumnsModule"
      },
      {
        "path": "components\/datatables\/base\/translation",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-translation\/base-translation.module#BaseTranslationModule"
      },
      {
        "path": "components\/datatables\/base\/local-sort",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-local-sort\/base-local-sort.module#BaseLocalSortModule"
      },
      {
        "path": "components\/datatables\/base\/html-table",
        "loadChildren": ".\/pages\/default\/components\/datatables\/base\/base-html-table\/base-html-table.module#BaseHtmlTableModule"
      },
      {
        "path": "components\/datatables\/scrolling\/vertical",
        "loadChildren": ".\/pages\/default\/components\/datatables\/scrolling\/scrolling-vertical\/scrolling-vertical.module#ScrollingVerticalModule"
      },
      {
        "path": "components\/datatables\/scrolling\/horizontal",
        "loadChildren": ".\/pages\/default\/components\/datatables\/scrolling\/scrolling-horizontal\/scrolling-horizontal.module#ScrollingHorizontalModule"
      },
      {
        "path": "components\/datatables\/scrolling\/both",
        "loadChildren": ".\/pages\/default\/components\/datatables\/scrolling\/scrolling-both\/scrolling-both.module#ScrollingBothModule"
      },
      {
        "path": "components\/datatables\/locked\/left",
        "loadChildren": ".\/pages\/default\/components\/datatables\/locked\/locked-left\/locked-left.module#LockedLeftModule"
      },
      {
        "path": "components\/datatables\/locked\/right",
        "loadChildren": ".\/pages\/default\/components\/datatables\/locked\/locked-right\/locked-right.module#LockedRightModule"
      },
      {
        "path": "components\/datatables\/locked\/both",
        "loadChildren": ".\/pages\/default\/components\/datatables\/locked\/locked-both\/locked-both.module#LockedBothModule"
      },
      {
        "path": "components\/datatables\/child\/data-local",
        "loadChildren": ".\/pages\/default\/components\/datatables\/child\/child-data-local\/child-data-local.module#ChildDataLocalModule"
      },
      {
        "path": "components\/datatables\/child\/data-ajax",
        "loadChildren": ".\/pages\/default\/components\/datatables\/child\/child-data-ajax\/child-data-ajax.module#ChildDataAjaxModule"
      },
      {
        "path": "components\/datatables\/api\/methods",
        "loadChildren": ".\/pages\/default\/components\/datatables\/api\/api-methods\/api-methods.module#ApiMethodsModule"
      },
      {
        "path": "components\/datatables\/api\/events",
        "loadChildren": ".\/pages\/default\/components\/datatables\/api\/api-events\/api-events.module#ApiEventsModule"
      },
      {
        "path": "components\/portlets\/base",
        "loadChildren": ".\/pages\/default\/components\/portlets\/portlets-base\/portlets-base.module#PortletsBaseModule"
      },
      {
        "path": "components\/portlets\/advanced",
        "loadChildren": ".\/pages\/default\/components\/portlets\/portlets-advanced\/portlets-advanced.module#PortletsAdvancedModule"
      },
      {
        "path": "components\/portlets\/creative",
        "loadChildren": ".\/pages\/default\/components\/portlets\/portlets-creative\/portlets-creative.module#PortletsCreativeModule"
      },
      {
        "path": "components\/portlets\/tabbed",
        "loadChildren": ".\/pages\/default\/components\/portlets\/portlets-tabbed\/portlets-tabbed.module#PortletsTabbedModule"
      },
      {
        "path": "components\/portlets\/draggable",
        "loadChildren": ".\/pages\/default\/components\/portlets\/portlets-draggable\/portlets-draggable.module#PortletsDraggableModule"
      },
      {
        "path": "components\/portlets\/tools",
        "loadChildren": ".\/pages\/default\/components\/portlets\/portlets-tools\/portlets-tools.module#PortletsToolsModule"
      },
      {
        "path": "components\/widgets\/general",
        "loadChildren": ".\/pages\/default\/components\/widgets\/widgets-general\/widgets-general.module#WidgetsGeneralModule"
      },
      {
        "path": "components\/widgets\/chart",
        "loadChildren": ".\/pages\/default\/components\/widgets\/widgets-chart\/widgets-chart.module#WidgetsChartModule"
      },
      {
        "path": "components\/calendar\/basic",
        "loadChildren": ".\/pages\/default\/components\/calendar\/calendar-basic\/calendar-basic.module#CalendarBasicModule"
      },
      {
        "path": "components\/calendar\/list-view",
        "loadChildren": ".\/pages\/default\/components\/calendar\/calendar-list-view\/calendar-list-view.module#CalendarListViewModule"
      },
      {
        "path": "components\/calendar\/google",
        "loadChildren": ".\/pages\/default\/components\/calendar\/calendar-google\/calendar-google.module#CalendarGoogleModule"
      },
      {
        "path": "components\/calendar\/external-events",
        "loadChildren": ".\/pages\/default\/components\/calendar\/calendar-external-events\/calendar-external-events.module#CalendarExternalEventsModule"
      },
      {
        "path": "components\/calendar\/background-events",
        "loadChildren": ".\/pages\/default\/components\/calendar\/calendar-background-events\/calendar-background-events.module#CalendarBackgroundEventsModule"
      },
      {
        "path": "components\/charts\/amcharts\/charts",
        "loadChildren": ".\/pages\/default\/components\/charts\/amcharts\/amcharts-charts\/amcharts-charts.module#AmchartsChartsModule"
      },
      {
        "path": "components\/charts\/amcharts\/stock-charts",
        "loadChildren": ".\/pages\/default\/components\/charts\/amcharts\/amcharts-stock-charts\/amcharts-stock-charts.module#AmchartsStockChartsModule"
      },
      {
        "path": "components\/charts\/amcharts\/maps",
        "loadChildren": ".\/pages\/default\/components\/charts\/amcharts\/amcharts-maps\/amcharts-maps.module#AmchartsMapsModule"
      },
      {
        "path": "components\/charts\/flotcharts",
        "loadChildren": ".\/pages\/default\/components\/charts\/charts-flotcharts\/charts-flotcharts.module#ChartsFlotchartsModule"
      },
      {
        "path": "components\/charts\/google-charts",
        "loadChildren": ".\/pages\/default\/components\/charts\/charts-google-charts\/charts-google-charts.module#ChartsGoogleChartsModule"
      },
      {
        "path": "components\/charts\/morris-charts",
        "loadChildren": ".\/pages\/default\/components\/charts\/charts-morris-charts\/charts-morris-charts.module#ChartsMorrisChartsModule"
      },
      {
        "path": "components\/maps\/google-maps",
        "loadChildren": ".\/pages\/default\/components\/maps\/maps-google-maps\/maps-google-maps.module#MapsGoogleMapsModule"
      },
      {
        "path": "components\/maps\/jqvmap",
        "loadChildren": ".\/pages\/default\/components\/maps\/maps-jqvmap\/maps-jqvmap.module#MapsJqvmapModule"
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
