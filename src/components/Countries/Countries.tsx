import { use } from "react";
import type { CountryType } from "../../type";
import Country from "../Country/Country";
import "./Countries.css";

export interface CountriesProps {
  countriesPromise: Promise<CountryType[]>;
}

export default function Countries({ countriesPromise }: CountriesProps) {
  const countries = use(countriesPromise);

  return (
    <div>
      <h2>Country Name Details: </h2>
      <div className="countries">
        {countries.map((country) => (
          <Country key={country.cca3} country={country} />
        ))}
      </div>
    </div>
  );
}
