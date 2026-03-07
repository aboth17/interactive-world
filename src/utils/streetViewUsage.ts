const STORAGE_KEY = 'world-explorer-sv-usage';
const MONTHLY_LIMIT = 5000; // Dynamic Street View free tier

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
    // Reset if month rolled over
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

export function canLoadPanorama(): boolean {
  return load().count < MONTHLY_LIMIT;
}

export function recordPanoramaLoad(): void {
  const data = load();
  data.count += 1;
  save(data);
}

export function getUsage(): { count: number; limit: number } {
  return { count: load().count, limit: MONTHLY_LIMIT };
}
