import { Observable } from 'rxjs';
import { deferFetch } from './core';
import 'rx-to-csv';

const ProgressBar = require('progress');
const size = 100;

let bar;

deferFetch('https://data.opendatasoft.com/api/v2/catalog/datasets?rows=0&start=0')
  .map((result) => Math.ceil(result.total_count / size))
  .do((count) =>{
    bar = new ProgressBar('downloading :bar :current / :total', { total: count });
  })
  .concatMap((count) => Observable.range(0, count))
  .concatMap((i) => {
    return deferFetch(`https://data.opendatasoft.com/api/v2/catalog/datasets?rows=${size}&start=${i * size}`);
  })
  .do(() => bar.tick())
  .mergeMap((result) => Observable.of(...result.datasets))
  .reduce((sources, item) => {
    let attr = item.dataset.metas.default;
    let updated = new Date(attr.modified);

    if (sources[attr.source_domain_title]) {
      sources[attr.source_domain_title].datasets = sources[attr.source_domain_title].datasets + 1;

      if (sources[attr.source_domain_title].updated < updated) {
        sources[attr.source_domain_title].updated = updated;
      }
    } else {
      sources[attr.source_domain_title] = {
        name: attr.source_domain_title.trim(),
        url: attr.source_domain_address,
        datasets: 1,
        updated
      };
    }

    return sources;
  }, {})
  .mergeMap((data) => {
    let sources = [];

    for (let name in data) {
      sources.push(data[name]);
    }

    return Observable.of(...sources);
  })
  .map((source) => {
    source.updated = `${source.updated.getFullYear()}-${source.updated.getMonth() + 1}-${source.updated.getDate()}`;
    return source;
  })
  .toCSV('result/opendatasoft-portals.csv', ['name', 'url', 'datasets', 'updated'])
  .subscribe(
    () => {},
    (err) => console.error(err),
    () => console.log('complete!')
  );
