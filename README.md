# portal-list

Scripts to produce portal lists from various sources

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
