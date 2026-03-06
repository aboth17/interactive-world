import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export interface CountryFeature {
  type: 'Feature';
  id: string;
  geometry: Polygon | MultiPolygon;
  properties: { name: string };
}

export interface CountryInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

let allFeaturesCache: CountryFeature[] | null = null;
let countryInfoCache: CountryInfo[] | null = null;

function computeCentroid(feature: CountryFeature): { lat: number; lng: number } {
  let sumLat = 0, sumLng = 0, count = 0;
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates;

  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const coord of ring) {
        sumLng += coord[0];
        sumLat += coord[1];
        count++;
      }
    }
  }

  return { lat: sumLat / count, lng: sumLng / count };
}

async function loadAllFeatures(): Promise<CountryFeature[]> {
  if (allFeaturesCache) return allFeaturesCache;

  const response = await fetch('/data/countries-50m.json');
  const topology = (await response.json()) as Topology;

  const countriesObject = topology.objects.countries as GeometryCollection;
  const allCountries = topojson.feature(topology, countriesObject) as FeatureCollection;

  allFeaturesCache = allCountries.features.filter(f => f.id) as CountryFeature[];
  return allFeaturesCache;
}

export async function loadCountryInfo(): Promise<CountryInfo[]> {
  if (countryInfoCache) return countryInfoCache;

  const features = await loadAllFeatures();
  countryInfoCache = features.map(f => {
    const centroid = computeCentroid(f);
    return {
      id: String(f.id),
      name: f.properties.name,
      lat: centroid.lat,
      lng: centroid.lng,
    };
  });

  return countryInfoCache;
}

export async function loadVisitedCountryFeatures(visitedIds: Set<string>): Promise<CountryFeature[]> {
  const all = await loadAllFeatures();
  return all.filter(f => visitedIds.has(String(f.id)));
}
