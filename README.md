# portal-list

Scripts to produce portal lists from various sources.

All scripts are written in [TypeScript](http://www.typescriptlang.org/).

## Scripts

### arcgis-source.ts

a script to list all data publishers at [ArcGIS Open Data](https://hub.arcgis.com/pages/open-data) and information:

  * name
  * total number of datasets
  * last updated date

run the script with

``` bash
ts-node arcgis-source.ts
```

a csv file will be generated at `result/arcgis-sources.csv`.

### socrata-portals.ts

a script to list all data portals at [Socrata](https://socrata.com/) and information:

  * url
  * total number of datasets

run the script with

``` bash
ts-node socrata.ts
```

a csv file will be generated at `result/socrata-portals.csv`.

### opendatasoft.ts

a script to list all data portals at [OpenDataSoft](https://www.opendatasoft.com/) and information:

  * name
  * url
  * total number of datasets
  * updated

run the script with

``` bash
ts-node opendatasoft.ts
```

a csv file will be generated at `result/opendatasoft-portals.csv`.

