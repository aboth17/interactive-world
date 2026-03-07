import type { City } from '../data/visitedCities';

const STORAGE_KEY = 'world-explorer-visited';

interface StoredData {
  countryCodes: string[];
  cities: City[];
}

type Listener = () => void;

class VisitedStore {
  private countryCodes: Set<string>;
  private cities: City[];
  private listeners: Set<Listener> = new Set();

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StoredData = JSON.parse(stored);
      this.countryCodes = new Set(data.countryCodes);
      this.cities = data.cities;
    } else {
      this.countryCodes = new Set();
      this.cities = [];
    }
  }

  addCountry(code: string) {
    if (this.countryCodes.has(code)) return;
    this.countryCodes.add(code);
    this.save();
    this.notify();
  }

  removeCountry(code: string) {
    if (!this.countryCodes.has(code)) return;
    this.countryCodes.delete(code);
    this.cities = this.cities.filter(c => c.countryId !== code);
    this.save();
    this.notify();
  }

  addCity(city: City) {
    this.countryCodes.add(city.countryId);
    if (!this.cities.some(c => c.name === city.name && c.countryId === city.countryId)) {
      this.cities.push(city);
    }
    this.save();
    this.notify();
  }

  removeCity(name: string, countryId: string) {
    this.cities = this.cities.filter(c => !(c.name === name && c.countryId === countryId));
    this.save();
    this.notify();
  }

  getCountryCodes(): Set<string> {
    return new Set(this.countryCodes);
  }

  getCities(): City[] {
    return [...this.cities];
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private save() {
    const data: StoredData = {
      countryCodes: Array.from(this.countryCodes),
      cities: this.cities,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const visitedStore = new VisitedStore();
