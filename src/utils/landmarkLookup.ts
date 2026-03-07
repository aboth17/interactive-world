import { loadGoogleMapsApi } from './googleMapsLoader';
import { canUseApi, recordApiCalls } from './streetViewUsage';

const CACHE_KEY = 'world-explorer-landmarks';

interface CachedLandmark {
  lat: number;
  lng: number;
  name: string;
}

function loadCache(): Record<string, CachedLandmark> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, CachedLandmark>) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

/**
 * Finds the most iconic landmark in a city using Google Places nearbySearch.
 * Uses prominence ranking + most reviews to pick the most recognizable spot.
 * Results are cached in localStorage so each city is only looked up once.
 */
export async function findLandmark(
  cityName: string,
  cityLat: number,
  cityLng: number,
): Promise<{ lat: number; lng: number; name: string } | null> {
  const cacheKey = `${cityName}|${cityLat.toFixed(2)}|${cityLng.toFixed(2)}`;
  const cache = loadCache();

  if (cache[cacheKey]) {
    const c = cache[cacheKey];
    return { lat: c.lat, lng: c.lng, name: c.name };
  }

  if (!canUseApi()) return null;

  try {
    await loadGoogleMapsApi();

    const location = new google.maps.LatLng(cityLat, cityLng);
    const dummyDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(dummyDiv);

    // nearbySearch ranked by prominence (default when radius is set)
    const results = await new Promise<google.maps.places.PlaceResult[]>(
      (resolve) => {
        service.nearbySearch(
          {
            location,
            radius: 25000,
            type: 'tourist_attraction',
          },
          (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results &&
              results.length > 0
            ) {
              resolve(results);
            } else {
              resolve([]);
            }
          },
        );
      },
    );

    recordApiCalls(1);

    if (results.length === 0) return null;

    // Pick the result with the most reviews from the top results
    let best = results[0];
    for (let i = 1; i < Math.min(results.length, 10); i++) {
      if ((results[i].user_ratings_total ?? 0) > (best.user_ratings_total ?? 0)) {
        best = results[i];
      }
    }

    if (best.geometry?.location) {
      const landmark: CachedLandmark = {
        lat: best.geometry.location.lat(),
        lng: best.geometry.location.lng(),
        name: best.name || cityName,
      };
      cache[cacheKey] = landmark;
      saveCache(cache);
      return { lat: landmark.lat, lng: landmark.lng, name: landmark.name };
    }
  } catch {
    // Places API not enabled or error — fall back silently
  }

  return null;
}
