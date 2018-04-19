import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { FeatureService } from '../../_services/feature.service';
import { Feature } from "../../_models/feature";

@Component({
  selector: "app-feature-list",
  templateUrl: "./feature-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FeatureListComponent implements OnInit {
  featureList: Observable<Feature[]>;
  constructor(private featureService: FeatureService,
    private router: Router) {
  }

  ngOnInit() {
    this.getAllFeatures();
  }

  getAllFeatures() {
    this.featureList = this.featureService.getAllFeatures();
  }  
}
