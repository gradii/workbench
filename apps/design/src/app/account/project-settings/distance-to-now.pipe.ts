import { Pipe, PipeTransform } from '@angular/core';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

@Pipe({
  name: 'distanceToNow',
  pure: true
})
export class DistanceToNowPipe implements PipeTransform {
  transform(value: string, includeSeconds = true): any {
    return formatDistanceToNow(new Date(value), { includeSeconds });
  }
}
