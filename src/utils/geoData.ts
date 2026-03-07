import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson';
import { WORLD_CITIES, type WorldCity } from '../data/worldCities';

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

// Ray-casting point-in-polygon for a single ring
function pointInRing(lat: number, lng: number, ring: Position[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = ((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInFeature(lat: number, lng: number, feature: CountryFeature): boolean {
  const { geometry } = feature;
  const polygons = geometry.type === 'Polygon'
    ? [geometry.coordinates]
    : geometry.coordinates;

  for (const polygon of polygons) {
    const outerRing = polygon[0];
    if (pointInRing(lat, lng, outerRing)) return true;
  }
  return false;
}

export async function getCountryAtPoint(lat: number, lng: number): Promise<CountryFeature | null> {
  const features = await loadAllFeatures();
  return features.find(f => pointInFeature(lat, lng, f)) ?? null;
}

const CITY_SEARCH_RADIUS_KM = 75;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearestCity(lat: number, lng: number): WorldCity | null {
  let best: WorldCity | null = null;
  let bestDist = CITY_SEARCH_RADIUS_KM;
  for (const city of WORLD_CITIES) {
    const dist = haversineKm(lat, lng, city.lat, city.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = city;
    }
  }
  return best;
}
