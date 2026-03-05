import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { VISITED_COUNTRY_IDS } from '../data/visitedCountries';

export interface CountryFeature {
  type: 'Feature';
  id: string;
  geometry: Polygon | MultiPolygon;
  properties: { name: string };
}

let cachedFeatures: CountryFeature[] | null = null;

export async function loadVisitedCountryFeatures(): Promise<CountryFeature[]> {
  if (cachedFeatures) return cachedFeatures;

  const response = await fetch('/data/countries-50m.json');
  const topology = (await response.json()) as Topology;

  const countriesObject = topology.objects.countries as GeometryCollection;
  const allCountries = topojson.feature(topology, countriesObject) as FeatureCollection;

  cachedFeatures = allCountries.features.filter(
    (f) => f.id && VISITED_COUNTRY_IDS.has(String(f.id))
  ) as CountryFeature[];

  return cachedFeatures;
}
