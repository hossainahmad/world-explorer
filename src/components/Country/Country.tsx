import { useState } from "react";
import type { CountryType } from "../../type";
import "./Country.css";

export interface CountryProps {
  country: CountryType;
}

export default function Country({ country }: CountryProps) {
  const [Visited, setVisited] = useState<boolean>(false);
  const handleVisited = () => {
    if (Visited) {
      setVisited(false);
    } else {
      setVisited(true);
    }
  };

  return (
    <div className={`country ${Visited ? "country-visited" : ""}`}>
      <h2>{country.name.common}</h2>
      <img src={country.flags.flags.png} alt={country.flags.flags.alt} />
      <p>Capital:{country.capital.capital}</p>
      <p>Population: {country.population.population} </p>
      <button onClick={handleVisited} className="btn btn-active btn-secondary">
        {Visited ? "Visited" : "Mark as Visited"}
      </button>
    </div>
  );
}
