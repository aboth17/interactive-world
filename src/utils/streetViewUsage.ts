const STORAGE_KEY = 'world-explorer-api-usage';
const MONTHLY_LIMIT = 5000;

interface UsageData {
  month: string; // "YYYY-MM"
  count: number;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function load(): UsageData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data: UsageData = JSON.parse(stored);
    if (data.month !== currentMonth()) {
      return { month: currentMonth(), count: 0 };
    }
    return data;
  }
  return { month: currentMonth(), count: 0 };
}

function save(data: UsageData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Check if we have budget for N API calls. */
export function canUseApi(calls = 1): boolean {
  return load().count + calls <= MONTHLY_LIMIT;
}

/** Record N Google Maps API calls (panorama loads, places lookups, etc.) */
export function recordApiCalls(calls = 1): void {
  const data = load();
  data.count += calls;
  save(data);
}

export function getUsage(): { count: number; limit: number } {
  return { count: load().count, limit: MONTHLY_LIMIT };
}
