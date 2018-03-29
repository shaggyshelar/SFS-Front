import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../helpers';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body",
  templateUrl: "./default.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class DefaultComponent implements OnInit {


  constructor() {

  }
  ngOnInit() {

  }

}


@Pipe({
  name: 'dateIst'
})
export class DateIst implements PipeTransform {

  transform(date: string): any {
    date = date ? date.split('T')[0] : '';
    console.log(date);
    return date==''?null:new Date(date);
  }

}
