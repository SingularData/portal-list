import { Observable } from 'rxjs';
import * as cheerio from 'cheerio';
import { deferFetch } from '../core';

const regions = [
  'http://api.us.socrata.com/api/catalog/v1/domains',
  'http://api.eu.socrata.com/api/catalog/v1/domains'
];

export function getPortals() {
  return Observable.of(...regions)
    .mergeMap((url) => deferFetch(url))
    .mergeMap((result: any) => Observable.of(...result.results))
    .map((portal) => {
      return {
        url: portal.domain,
        datasets: portal.count
      };
    })
    .mergeMap((portal: any) => {
      return deferFetch(portal.url, false)
        .map((result) => {
          let $ = cheerio.load(result);
          portal.name = $('title').text();

          if (portal.name === 'The page cannot be displayed') {
            portal.name = portal.url;
          }

          return portal;
        })
        .catch(() => {
          portal.name = portal.url;

          return Observable.of(portal);
        })
    });
}

