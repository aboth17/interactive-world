let loadPromise: Promise<void> | null = null;

async function fetchApiKey(): Promise<string> {
  const workerUrl = import.meta.env.VITE_API_WORKER_URL;
  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl}/api-key`);
      if (res.ok) {
        const { key } = await res.json();
        if (key) return key;
      }
    } catch {
      // Fall through to env var
    }
  }

  // Fallback for local dev
  const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (envKey) return envKey;

  throw new Error(
    'No Google Maps API key available. Set VITE_API_WORKER_URL or VITE_GOOGLE_MAPS_API_KEY.'
  );
}

export function loadGoogleMapsApi(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    if (window.google?.maps) return;

    const apiKey = await fetchApiKey();

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=streetView,places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps API'));
      document.head.appendChild(script);
    });
  })();

  return loadPromise;
}
