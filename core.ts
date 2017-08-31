import fetch from 'node-fetch';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

export function deferFetch(url: string, json: boolean = true): any {
  url = _.startsWith(url, 'http') ? url : `http://${url}`;

  return Observable.defer(() => Observable.fromPromise(fetch(url).then((res) => {
    if (json) {
      return res.json();
    }

    return res.text();
  })));
}
