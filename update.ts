import { Observable } from 'rxjs';
import { get as getConfig } from 'config';
import { parse } from 'url';
import { getPortals as getSocrata } from './platform/socrata';
import { getPortals as getOpenDataSoft } from './platform/opendatasoft';
import * as _ from 'lodash';
import pgrx from 'pg-reactive';

const db = new pgrx(getConfig('database.url') as string);

// task to get a list of existing portals

let portals = [];
let getExisting = db.query('SELECT url FROM portal')
  .do((portal) => {
    let url = portal.url.startsWith('http') ? portal.url : 'http://' + portal.url;
    let parsed = parse(url);
    portals.push(parsed.hostname);
  });

// task to get portal list

let updateSocrata = getSocrata()
  .filter((portal: any) => {
    let parsed = parse('http://' + portal.url);
    return portals.indexOf(parsed.hostname) === -1;
  })
  .do((portal) => console.log(`Adding portal ${portal.name}`))
  .concatMap((portal) => {
    let insertSQL = `
      INSERT INTO portal (name, url, platform_id) VALUES
        ($1::text, $2::text, (SELECT id FROM platform WHERE name = $3::text));
    `
    let platform = portal.region === 'eu' ? 'Socrata-EU' : 'Socrata';

    return db.query(insertSQL, [portal.name, portal.url, platform]);
  });

let updateOpenDataSoft = getOpenDataSoft()
  .filter((portal: any) => {
    let parsed = parse('http://' + portal.url);
    return portals.indexOf(parsed.hostname) === -1;
  })
  .do((portal) => console.log(`Adding portal ${portal.name}`))
  .concatMap((portal) => {
    let insertSQL = `
      INSERT INTO portal (name, url, platform_id) VALUES
        ($1::text, $2::text, (SELECT id FROM platform WHERE name = $3::text));
    `

    return db.query(insertSQL, [portal.name, portal.url, 'OpenDataSoft']);
  });

Observable.concat(getExisting, updateSocrata, updateOpenDataSoft)
  .subscribe(
    _.noop,
    (err) => console.error(err),
    () => console.log('complete')
  )