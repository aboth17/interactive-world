import { supabase } from '../lib/supabase';
import type { City } from '../data/visitedCities';

const STORAGE_KEY = 'world-explorer-visited';
const COUNTRY_SENTINEL = '__country__';

interface StoredData {
  countryCodes: string[];
  cities: City[];
}

type Listener = () => void;

class VisitedStore {
  private countryCodes: Set<string>;
  private cities: City[];
  private listeners: Set<Listener> = new Set();
  private userId: string | null = null;

  constructor() {
    // Read localStorage for instant display on boot (before Supabase hydration)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StoredData = JSON.parse(stored);
        this.countryCodes = new Set(data.countryCodes);
        this.cities = data.cities;
      } catch {
        this.countryCodes = new Set();
        this.cities = [];
      }
    } else {
      this.countryCodes = new Set();
      this.cities = [];
    }
  }

  /**
   * Initialize with a user ID. Migrates any localStorage data,
   * then hydrates from Supabase. Called after auth is ready.
   */
  async init(userId: string): Promise<void> {
    this.userId = userId;
    await this.migrateFromLocalStorage();
    await this.hydrate();
  }

  addCountry(code: string) {
    if (this.countryCodes.has(code)) return;
    this.countryCodes.add(code);
    this.notify();
    this.persistCountry(code);
  }

  removeCountry(code: string) {
    if (!this.countryCodes.has(code)) return;
    this.countryCodes.delete(code);
    this.cities = this.cities.filter((c) => c.countryId !== code);
    this.notify();
    this.deleteCountryVisits(code);
  }

  addCity(city: City) {
    this.countryCodes.add(city.countryId);
    if (
      !this.cities.some(
        (c) => c.name === city.name && c.countryId === city.countryId
      )
    ) {
      this.cities.push(city);
    }
    this.notify();
    this.persistCity(city);
  }

  removeCity(name: string, countryId: string) {
    this.cities = this.cities.filter(
      (c) => !(c.name === name && c.countryId === countryId)
    );
    this.notify();
    this.deleteCityVisit(name, countryId);
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

  // --- Private: Supabase persistence (fire-and-forget) ---

  private async persistCity(city: City) {
    if (!this.userId) return;
    try {
      await supabase.from('visits').upsert(
        {
          user_id: this.userId,
          city: city.name,
          country_code: city.countryId,
          lat: city.lat,
          lng: city.lng,
        },
        { onConflict: 'user_id,city,country_code' }
      );
    } catch (err) {
      console.error('Failed to persist city:', err);
    }
  }

  private async persistCountry(countryCode: string) {
    if (!this.userId) return;
    try {
      await supabase.from('visits').upsert(
        {
          user_id: this.userId,
          city: COUNTRY_SENTINEL,
          country_code: countryCode,
          lat: 0,
          lng: 0,
        },
        { onConflict: 'user_id,city,country_code' }
      );
    } catch (err) {
      console.error('Failed to persist country:', err);
    }
  }

  private async deleteCountryVisits(countryCode: string) {
    if (!this.userId) return;
    try {
      await supabase
        .from('visits')
        .delete()
        .eq('user_id', this.userId)
        .eq('country_code', countryCode);
    } catch (err) {
      console.error('Failed to delete country visits:', err);
    }
  }

  private async deleteCityVisit(cityName: string, countryCode: string) {
    if (!this.userId) return;
    try {
      await supabase
        .from('visits')
        .delete()
        .eq('user_id', this.userId)
        .eq('city', cityName)
        .eq('country_code', countryCode);
    } catch (err) {
      console.error('Failed to delete city visit:', err);
    }
  }

  private async hydrate() {
    if (!this.userId) return;
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('user_id', this.userId);

      if (error) throw error;
      if (!data) return;

      this.countryCodes = new Set<string>();
      this.cities = [];

      for (const row of data) {
        this.countryCodes.add(row.country_code);
        if (row.city !== COUNTRY_SENTINEL) {
          this.cities.push({
            name: row.city,
            lat: row.lat,
            lng: row.lng,
            countryId: row.country_code,
          });
        }
      }

      this.notify();
    } catch (err) {
      console.error('Failed to hydrate from Supabase:', err);
    }
  }

  private async migrateFromLocalStorage() {
    if (!this.userId) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const data: StoredData = JSON.parse(stored);
      const rows: {
        user_id: string;
        city: string;
        country_code: string;
        lat: number;
        lng: number;
      }[] = [];

      // Country-only sentinel rows
      for (const code of data.countryCodes) {
        rows.push({
          user_id: this.userId,
          city: COUNTRY_SENTINEL,
          country_code: code,
          lat: 0,
          lng: 0,
        });
      }

      // City rows
      for (const city of data.cities) {
        rows.push({
          user_id: this.userId,
          city: city.name,
          country_code: city.countryId,
          lat: city.lat,
          lng: city.lng,
        });
      }

      if (rows.length > 0) {
        const { error } = await supabase
          .from('visits')
          .upsert(rows, { onConflict: 'user_id,city,country_code' });

        if (error) throw error;
      }

      // Migration succeeded — clear localStorage
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to migrate from localStorage:', err);
      // Keep localStorage intact so we can retry next time
    }
  }

  /**
   * Reset in-memory state (used on user switch).
   */
  reset() {
    this.countryCodes = new Set();
    this.cities = [];
    this.userId = null;
    this.notify();
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }
}

export const visitedStore = new VisitedStore();
