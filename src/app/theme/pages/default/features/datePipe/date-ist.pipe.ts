import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateIst'
})
export class DateIst implements PipeTransform {

  transform(date: string): any {
    date = date ? date.split('T')[0] : '';
    return date==''?null:new Date(date);
  }

}
