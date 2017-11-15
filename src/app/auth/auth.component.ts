import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ScriptLoaderService } from "../_services/script-loader.service";
import { GlobalErrorHandler } from '../_services/error-handler.service';
import { AuthenticationService } from "./_services/authentication.service";
import { AlertService } from "./_services/alert.service";
import { UserService } from "./_services/user.service";
import { StoreService } from "../_services/store.service";
import { AlertComponent } from "./_directives/alert.component";
import { LoginCustom } from "./_helpers/login-custom";
import { Helpers } from "../helpers";
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { UserSchoolDetailsService } from '../theme/pages/default/_services/userschooldetails.service';

@Component({
  selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
  templateUrl: './templates/login-1.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AuthComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  @ViewChild('alertSignin', { read: ViewContainerRef }) alertSignin: ViewContainerRef;
  @ViewChild('alertSignup', { read: ViewContainerRef }) alertSignup: ViewContainerRef;
  @ViewChild('alertForgotPass', { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

  constructor(private _router: Router,
    private _script: ScriptLoaderService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private _globalErrorHandler: GlobalErrorHandler,
    private _userSchoolDetailsService: UserSchoolDetailsService,
    private storeService:StoreService,
    private cfr: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.model.remember = true;
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    this._router.navigate([this.returnUrl]);

    this._script.load('body', 'assets/vendors/base/vendors.bundle.js', 'assets/demo/default/base/scripts.bundle.js')
      .then(() => {
        Helpers.setLoading(false);
        LoginCustom.init();
      });
  }

  signin() {
    this.loading = true;
    this._authService.login(this.model.username, this.model.password)
      .subscribe(
      data => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.storeService.getPermission();
        if (currentUser && currentUser.user) {
          let _superAdmin = _.find(currentUser.roles, { 'name': 'SuperAdmin' });
          if (currentUser.user.isPasswordChanged === false) {
            this._router.navigate(['/changePassword']);
          }
          else if (!_superAdmin) {
            this._userSchoolDetailsService.getSchoolsByUser(currentUser.userId)
              .subscribe(
              results => {
                if (results.length > 1) {
                  this._router.navigate(['/selectSchool']);
                }
                else {
                  debugger;
                  localStorage.setItem('schoolLogo', results[0].UserschoolSchool.schoolLogo);
                  localStorage.setItem('schoolHeader', results[0].UserschoolSchool.schoolHeader);
                  
                  localStorage.setItem('schoolId', results[0].UserschoolSchool.id);
                  localStorage.setItem('instituteId', results[0].UserschoolSchool.instituteId);
                  this._router.navigate([this.returnUrl]);
                };
              },
              error => {
                this._globalErrorHandler.handleError(error);
              });
          }
          else {
            this._router.navigate([this.returnUrl]);
          }
        }
      },
      error => {
        this.showAlert('alertSignin');
        this._alertService.error(JSON.parse(error._body).Message);
        this.loading = false;
      });
  }

  signup() {
    this.loading = true;
    this._userService.create(this.model)
      .subscribe(
      data => {
        this.showAlert('alertSignin');
        this._alertService.success('Thank you. To complete your registration please check your email.', true);
        this.loading = false;
        LoginCustom.displaySignInForm();
        this.model = {};
      },
      error => {
        this.showAlert('alertSignup');
        this._alertService.error(error);
        this.loading = false;
      });
  }

  forgotPass() {
    this.loading = true;
    let email = {
      email: this.model.email
    };
    this._userService.forgotPassword(email)
      .subscribe(
      data => {
        this.showAlert('alertSignin');
        this._alertService.success('Cool! Password recovery instruction has been sent to your email.', true);
        this.loading = false;
        LoginCustom.displaySignInForm();
        this.model = {};
      },
      error => {
        this.showAlert('alertForgotPass');
        this._alertService.error(error.json().error.message);
        this.loading = false;
      });
  }

  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
}
