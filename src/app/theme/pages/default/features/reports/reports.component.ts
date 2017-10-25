import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./reports.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../../../../../node_modules/primeng/resources/primeng.css',
    '../../../../../../../node_modules/primeng/resources/themes/bootstrap/theme.css',
  ]
})
export class ReportsComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
