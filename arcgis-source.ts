import { Observable } from 'rxjs';
import { deferFetch } from './core';
import 'rx-to-csv';

const ProgressBar = require('progress');
const size = 1000;

let bar;

deferFetch('https://opendata.arcgis.com/api/v2/datasets?page[number]=1&page[size]=0')
  .map((result) => Math.ceil(result.meta.stats.totalCount / size))
  .do((count) =>{
    bar = new ProgressBar('downloading :bar :current / :total', { total: count });
  })
  .concatMap((count) => Observable.range(0, count))
  .concatMap((i) => {
    return deferFetch(`https://opendata.arcgis.com/api/v2/datasets?page[number]=${i}&page[size]=${size}`);
  })
  .do(() => bar.tick())
  .mergeMap((result) => Observable.of(...result.data))
  .reduce((sources, dataset) => {
    let updated = new Date(dataset.updatedAt);

    if (sources[dataset.source]) {
      sources[dataset.source].dataset = sources[dataset.source].dataset + 1;

      if (sources[dataset.source].updated < updated) {
        sources[dataset.source].updated = updated;
      }
    } else {
      sources[dataset.source] = {
        name: dataset.source,
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
  .toCSV('result/arcgis-sources.csv', ['name', 'datasets', 'updated'])
  .subscribe(
    () => {},
    (err) => console.error(err),
    () => console.log('complete!')
  );
