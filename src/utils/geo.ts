import { useUserStore } from '@/store/userStore';

export async function reverseGeocode(lat: number, lng: number): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    return data?.address || null;
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return null;
  }
}

export async function detectUserLocation() {
  const { setCity, setCountry, setError } = useUserStore.getState();

  if (!navigator.geolocation) {
    setError('Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async pos => {
      const { latitude, longitude } = pos.coords;
      const address = await reverseGeocode(latitude, longitude);
      if (address) {
        setError(null);
        setCity(address.city || address.town || address.village || null);
        // Use state/province if available, otherwise use country
        setCountry(address.state || address.country || null);
      } else {
        setError('Reverse geocoding failed');
        console.error('Could not detect location!');
      }
    },
    err => {
      setError(err.message);
    },
  );
}