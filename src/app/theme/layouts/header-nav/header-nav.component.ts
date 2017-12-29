import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { ImageUploadService } from '../../pages/default/_services/imageUpload.service';
import { Router } from "@angular/router";
declare let mLayout: any;
@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

  schoolHeader: string;
  logoUrl: string;
  defaultLogo : string;
  userRole: string;
  loggedInUser: any;
  schoolLogoShow : boolean;
  constructor(private _router: Router, private imageUploadService: ImageUploadService) {
  }
  ngOnInit() {
    // if (localStorage.getItem("schoolLogo") != null) {
    //   this.logoUrl =  this.imageUploadService.getImageUrl();
    // }else{
    //   this.logoUrl = "./assets/img/phiLogo.png";
    // }
    this.userRole = '';
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInUser = currentUser;
    if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
      this.userRole = currentUser.roles[0].name;
    }
    if(this.userRole == "SuperAdmin"){
      this.schoolLogoShow = false;
    }
    else{
      this.schoolLogoShow = true;
    }
    this.defaultLogo = "./assets/img/phiLogo.png";
    //this.logoUrl = "./assets/img/phiLogo.png";
    this.logoUrl = this.imageUploadService.getImageUrl("default");
    if (localStorage.getItem("schoolLogo") != null) {
      let logo = localStorage.getItem("schoolLogo");
      if (logo != "" && logo != null && logo != "null") {
        this.logoUrl = this.imageUploadService.getImageUrl("");
      } else {
        this.logoUrl = this.imageUploadService.getImageUrl("default");
      }
    }

    if (localStorage.getItem("schoolHeader") != null) {
      this.schoolHeader = localStorage.getItem("schoolHeader");
    } else {
      this.schoolHeader = "School Fee System";

    }
  }
  ngAfterViewInit() {
    mLayout.initHeader();
  }

  removeSelectedSchool() {
    localStorage.removeItem('instituteId');
    localStorage.removeItem('schoolId');
    localStorage.removeItem('schoolLogo');
    localStorage.removeItem('schoolHeader');
    this.schoolHeader = "School Fee System";
    this.logoUrl = "./assets/img/phiLogo.png";
    window.location.href = '/'
    // this._router.navigate(['/']);
  }

}
