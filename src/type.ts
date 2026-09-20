export interface CountryName {
  common: string;
  official?: string;
}

export interface CountryFlags {
  png: string;
  svg?: string;
  alt?: string;
}

export interface CountryType {
  name: CountryName;
  flags: CountryFlags;
  capital?: string[];
  population: number;
  cca2?: string;
  cca3?: string;
  region?: string;
}
