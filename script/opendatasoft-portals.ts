import { Observable } from 'rxjs';
import { getPortals } from '../platform/opendatasoft';
import 'rx-to-csv';

getPortals()
  .map((source) => {
    source.updated = `${source.updated.getFullYear()}-${source.updated.getMonth() + 1}-${source.updated.getDate()}`;
    return source;
  })
  .toCSV('../result/opendatasoft-portals.csv', ['name', 'url', 'datasets', 'updated'])
  .subscribe(
    () => {},
    (err) => console.error(err),
    () => console.log('complete!')
  );
