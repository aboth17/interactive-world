export interface City {
  name: string;
  lat: number;
  lng: number;
  countryId: string;
}

export const VISITED_CITIES: City[] = [
  { name: 'New York', lat: 40.7128, lng: -74.006, countryId: '840' },
];
