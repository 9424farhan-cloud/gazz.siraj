import type { Mosque } from '../types';

export const mosqueService = {
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((R * c) * 100) / 100;
  },

  async fetchNearbyMosques(lat: number, lng: number, radiusMeters: number = 3000): Promise<Mosque[]> {
    try {
      const overpassQuery = `[out:json];node(around:${radiusMeters},${lat},${lng})[amenity=place_of_worship][religion=muslim];out 20;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
      
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const json = await res.json();
        const elements = json.elements || [];
        
        const mosques: Mosque[] = elements.map((item: any) => {
          const mLat = item.lat;
          const mLng = item.lon;
          const dist = this.calculateDistanceKm(lat, lng, mLat, mLng);
          const tags = item.tags || {};
          return {
            id: `osm_${item.id}`,
            name: tags.name || tags['name:id'] || 'Masjid Jami',
            distanceKm: dist,
            lat: mLat,
            lng: mLng,
            address: tags['addr:street'] ? `${tags['addr:street']} ${tags['addr:housenumber'] || ''}` : 'Sekitar lokasi anda'
          };
        });

        mosques.sort((a, b) => a.distanceKm - b.distanceKm);
        if (mosques.length > 0) return mosques;
      }
    } catch (err) {
      console.warn('Overpass OSM query failed or timed out:', err);
    }

    // Return empty list if no query returned (user can click Google Maps search link)
    return [];
  },

  async findNearbyMosques(lat: number, lng: number, radiusMeters: number = 3000): Promise<Mosque[]> {
    return this.fetchNearbyMosques(lat, lng, radiusMeters);
  },

  getGoogleMapsSearchUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/search/masjid+terdekat/@${lat},${lng},15z`;
  },

  getGoogleMapsDirectionsUrl(destLat: number, destLng: number): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
  },

  getGoogleMapsUrl(destLat: number, destLng: number, name?: string): string {
    return this.getGoogleMapsDirectionsUrl(destLat, destLng);
  }
};
