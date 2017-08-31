import { Observable } from 'rxjs';
import { deferFetch } from '../core';
import { getPortals } from '../platform/socrata';
import { writeFileSync } from 'fs';

let regions = [
  'http://api.us.socrata.com/api/catalog/v1/domains',
  'http://api.eu.socrata.com/api/catalog/v1/domains'
];

getPortals()
  .toArray()
  .subscribe(
    (data) => {
      let csv = 'url,name,datasets\n';

      data.forEach((row: any) => {
        csv += `${row.url},"${row.name}",${row.datasets}\n`;
      });

      writeFileSync('result/socrata-portals.csv', csv);
    },
    (err) => console.error(err),
    () => console.log('complete!')
  );
