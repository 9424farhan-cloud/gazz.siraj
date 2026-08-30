export interface CityLocation {
  name: string;
  province: string;
  lat: number;
  lng: number;
}

export const INDONESIA_CITIES: CityLocation[] = [
  { name: 'Jakarta (DKI Jakarta)', province: 'DKI Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Surabaya', province: 'Jawa Timur', lat: -7.2575, lng: 112.7521 },
  { name: 'Bandung', province: 'Jawa Barat', lat: -6.9175, lng: 107.6191 },
  { name: 'Medan', province: 'Sumatera Utara', lat: 3.5952, lng: 98.6722 },
  { name: 'Semarang', province: 'Jawa Tengah', lat: -6.9667, lng: 110.4167 },
  { name: 'Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lng: 119.4327 },
  { name: 'Palembang', province: 'Sumatera Selatan', lat: -2.9761, lng: 104.7754 },
  { name: 'Tangerang', province: 'Banten', lat: -6.1783, lng: 106.6319 },
  { name: 'Depok', province: 'Jawa Barat', lat: -6.4025, lng: 106.7942 },
  { name: 'Bekasi', province: 'Jawa Barat', lat: -6.2383, lng: 106.9756 },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { name: 'Surakarta (Solo)', province: 'Jawa Tengah', lat: -7.5755, lng: 110.8243 },
  { name: 'Bogor', province: 'Jawa Barat', lat: -6.5971, lng: 106.8060 },
  { name: 'Malang', province: 'Jawa Timur', lat: -7.9666, lng: 112.6326 },
  { name: 'Banda Aceh', province: 'Aceh', lat: 5.5483, lng: 95.3238 },
  { name: 'Padang', province: 'Sumatera Barat', lat: -0.9471, lng: 100.4172 },
  { name: 'Pekanbaru', province: 'Riau', lat: 0.5071, lng: 101.4478 },
  { name: 'Bandar Lampung', province: 'Lampung', lat: -5.4500, lng: 105.2667 },
  { name: 'Denpasar', province: 'Bali', lat: -8.6705, lng: 115.2126 },
  { name: 'Mataram', province: 'Nusa Tenggara Barat', lat: -8.5833, lng: 116.1167 },
  { name: 'Kupang', province: 'Nusa Tenggara Timur', lat: -10.1772, lng: 123.6070 },
  { name: 'Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lng: 109.3425 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3194, lng: 114.5908 },
  { name: 'Samarinda', province: 'Kalimantan Timur', lat: -0.5022, lng: 117.1536 },
  { name: 'Balikpapan', province: 'Kalimantan Timur', lat: -1.2379, lng: 116.8529 },
  { name: 'Manado', province: 'Sulawesi Utara', lat: 1.4748, lng: 124.8428 },
  { name: 'Palu', province: 'Sulawesi Tengah', lat: -0.8917, lng: 119.8707 },
  { name: 'Ambon', province: 'Maluku', lat: -3.6554, lng: 128.1906 },
  { name: 'Jayapura', province: 'Papua', lat: -2.5489, lng: 140.7197 },
  { name: 'Mekkah (Saudi Arabia)', province: 'International', lat: 21.4225, lng: 39.8262 },
  { name: 'Madinah (Saudi Arabia)', province: 'International', lat: 24.5247, lng: 39.5692 }
];
