const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

export const qiblaService = {
  calculateQiblaBearing(lat: number, lng: number): number {
    const latRad = (lat * Math.PI) / 180;
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
    const dLngRad = ((KAABA_LNG - lng) * Math.PI) / 180;

    const y = Math.sin(dLngRad);
    const x =
      Math.cos(latRad) * Math.tan(kaabaLatRad) -
      Math.sin(latRad) * Math.cos(dLngRad);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  },

  calculateDistanceToKaabaKm(lat: number, lng: number): number {
    const R = 6371; // Earth's radius in KM
    const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
    const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
    const lat1 = (lat * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  },

  calculateDistanceToKaaba(lat: number, lng: number): number {
    return this.calculateDistanceToKaabaKm(lat, lng);
  }
};
