import { Observable } from 'rxjs';
import { deferFetch } from './core';
import { writeFileSync } from 'fs';
import 'rx-to-csv';

let regions = [
  'http://api.us.socrata.com/api/catalog/v1/domains',
  'http://api.eu.socrata.com/api/catalog/v1/domains'
];

Observable.of(...regions)
  .mergeMap((url) => deferFetch(url))
  .mergeMap((result: any) => Observable.of(...result.results))
  .map((portal) => {
    return {
      url: portal.domain,
      datasets: portal.count
    };
  })
  .toArray()
  // .toCSV('result/socrata-portals.csv', ['url', 'datasets'])
  .subscribe(
    (data) => {
      let csv = 'url,datasets\n';

      for (let row of data) {
        csv += `${row.url},${row.datasets}\n`;
      }

      writeFileSync('result/socrata-portals.csv', csv);
    },
    (err) => console.error(err),
    () => console.log('complete!')
  );
