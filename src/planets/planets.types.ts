type Planet = {
  kepler_name: string;
  koi_prad: string;
  koi_insol: string;
  koi_disposition: 'CONFIRMED' | 'CANDITADE' | 'FALSE POSITIVE';
};

export type { Planet };
