import { mapTo, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/**
 * Combines source stream with the stream returned by projector.
 * */
export function combineWith<T, R>(projector: (param: T) => Observable<R>) {
  return mergeMap((param: T) => {
    return of(param).pipe(withLatestFrom(projector(param)));
  });
}

/**
 * Behaves like withLatestFrom except doesn't combine results in array, but return only data
 * from withLatestFrom observable.
 * */
export function onlyLatestFrom<T>(source: Observable<T>) {
  return withLatestFrom(source, (_, latest: T) => latest);
}

export function toVoid<T>(source: Observable<T>): Observable<void> {
  return source.pipe(mapTo(null));
}
