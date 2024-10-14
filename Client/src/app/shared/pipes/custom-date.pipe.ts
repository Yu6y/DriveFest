import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateCustom',
  standalone: true,
})
export class DateCustomPipe implements PipeTransform {
  transform(value: string | Date, format: string = 'yyyy-MM-dd'): string {
    const date = new Date(value);

    if (isNaN(date.getTime())) return value as string;

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
}
