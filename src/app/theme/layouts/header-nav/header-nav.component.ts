import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';

declare let mLayout: any;
@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {
  userRole: string;

  constructor() {

  }
  ngOnInit() {
    this.userRole = '';
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
        this.userRole = currentUser.roles[0].name;
    }
  }
  ngAfterViewInit() {

    mLayout.initHeader();

  }

}
