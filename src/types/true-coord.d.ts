// src/types/true-coord.d.ts

declare module "true-coord" {
  interface TrueCoord {
    /**
     * Returns an array of country names that share a land border
     * with the provided country name.
     */
    getNeighbors(countryName: string): string[];
  }

  const trueCoord: TrueCoord;
  export default trueCoord;
}
