import { Observable } from 'rxjs';
import * as cheerio from 'cheerio';
import { deferFetch } from '../core';

export function getPortals() {
  return Observable.concat(
    getPortalsFrom('http://api.us.socrata.com/api/catalog/v1/domains', 'us'),
    getPortalsFrom('http://api.eu.socrata.com/api/catalog/v1/domains', 'eu')
  )
}

function getPortalsFrom(url, region) {
  return deferFetch(url)
    .mergeMap((result: any) => Observable.of(...result.results))
    .map((portal) => {
      return {
        url: portal.domain,
        datasets: portal.count,
        region: region
      };
    })
    .mergeMap((portal: any) => {
      return deferFetch(portal.url, false)
        .map((result) => {
          let $ = cheerio.load(result);
          portal.name = ($('title').text() || '').trim();

          if (portal.name === 'The page cannot be displayed' ||
              !portal.name) {
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

