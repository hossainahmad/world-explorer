export interface CountryType {
  name: {
    common: string;
    official?: string;
  };
  capital?: {
    capital: string[];
  };
  population?: {
    population: number;
  };
  flags?: {
    flags: {
      png: string;
      svg: string;
      alt?: string;
    };
  };
  cca3?: {
    cca3: string;
  };
}
