import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PermissionService } from './theme/pages/default/_services/permission.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { MessageService } from "./_services/message.service";
import { GlobalErrorHandler } from "./_services/error-handler.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { StoreService } from "./_services/store.service";
import {
GrowlModule,
} from 'primeng/primeng';

@NgModule({
  declarations: [
    ThemeComponent,
    AppComponent,
  ],
  imports: [
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ThemeRoutingModule,
    AuthModule,
    GrowlModule,
  ],
  providers: [ScriptLoaderService, MessageService, GlobalErrorHandler,StoreService,PermissionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
