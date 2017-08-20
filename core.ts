import fetch from 'node-fetch';
import { Observable } from 'rxjs';

export function deferFetch(url: string): any {
  return Observable.defer(() => Observable.fromPromise(fetch(url).then((res) => res.json())));
}
