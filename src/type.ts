export interface CountryType {
  name?: {
    common?: string;
    official?: string;
  };
  capital?:
    | {
        capital?: string[];
      }
    | string[]
    | string;
  population?:
    | {
        population?: number;
      }
    | number;
  flags?: {
    flags?: {
      png?: string;
      svg?: string;
      alt?: string;
    };
    png?: string;
    svg?: string;
  };
  region?:
    | {
        region?: string;
      }
    | string;
  cca2?:
    | {
        cca2?: string;
      }
    | string;
  cca3?:
    | {
        cca3?: string;
      }
    | string;
  borders?: string[] | { borders?: string[] };
}
