import { useState } from "react";
import type { CountryType } from "../../type";
import "./Country.css";

export interface CountryProps {
  country: CountryType;
}

export default function Country({ country }: CountryProps) {
  const [Visited, setVisited] = useState<boolean>(false);
  const handleVisited = () => {
    // setVisited(true);
    if (Visited) {
      setVisited(false);
    } else {
      setVisited(true);
    }
  };

  return (
    <div className={`country ${Visited ? "country-visited" : ""}`}>
      <h3>{country.name.common}</h3>
      <img src={country.flags.flags.png} alt={country.flags.flags.alt} />
      <p>Capital:{country.capital.capital}</p>
      <p>Population: {country.population.population} </p>
      <button onClick={handleVisited}>
        {Visited ? "Visited" : "Mark as Visited"}j
      </button>
    </div>
  );
}
