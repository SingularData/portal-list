import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { deferFetch } from '../core';

const size = 100;

export function getPortals(options = {}) {
  return deferFetch('https://data.opendatasoft.com/api/v2/catalog/datasets?rows=0&start=0')
    .map((result) => Math.ceil(result.total_count / size))
    .concatMap((count) => Observable.range(0, count))
    .concatMap((i) => {
      return deferFetch(`https://data.opendatasoft.com/api/v2/catalog/datasets?rows=${size}&start=${i * size}`);
    })
    .map((result) => {
      let portals = _.reduce(result.datasets, (sources, item: any) => {
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
      }, {});

      return portals
    })
    .mergeMap((data) => {
      let sources = [];

      for (let name in data) {
        sources.push(data[name]);
      }

      return Observable.of(...sources);
    });
}

