import { use, useState } from "react";
import type { CountryType } from "../../type";
import Country from "../Country/Country";

interface CountriesProps {
  countriesPromise: Promise<CountryType[]>;
}

export default function Countries({ countriesPromise }: CountriesProps) {
  const countries = use(countriesPromise);
  const [visitedCount, setVisitedCount] = useState(0);

  const handleVisitedToggle = (_country: CountryType, isVisited: boolean) => {
    setVisitedCount((prev) => (isVisited ? prev + 1 : prev - 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            World Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore countries, flags, and keep track of places you have visited.
          </p>
        </div>

        <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700">
          Visited Countries:{" "}
          <span className="ml-2 px-2 py-0.5 bg-indigo-600 text-white rounded-md text-xs">
            {visitedCount}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {countries.map((country, idx) => {
          // Fallback key generator to prevent duplicate key error
          const uniqueKey =
            typeof country.cca3 === "string"
              ? country.cca3
              : typeof country.name?.common === "string"
                ? `${country.name.common}-${idx}`
                : `country-${idx}`;

          return (
            <Country
              key={uniqueKey}
              country={country}
              onVisitedToggle={handleVisitedToggle}
            />
          );
        })}
      </div>
    </div>
  );
}
