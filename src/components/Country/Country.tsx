import { useState } from "react";

interface CountryProps {
  country: any; // Using 'any' here or updated type interface to safely parse nested properties
  onVisitedToggle?: (country: any, isVisited: boolean) => void;
}

export default function Country({ country, onVisitedToggle }: CountryProps) {
  const [visited, setVisited] = useState(false);

  // 1. Extract Name
  const name = country?.name?.common ?? "Unknown Country";

  // 2. Extract Flag (double-nested under flags.flags)
  const flag =
    country?.flags?.flags?.png ||
    country?.flags?.flags?.svg ||
    country?.flags?.png ||
    country?.flags?.svg ||
    "";

  // 3. Extract Capital (nested under capital.capital array)
  const rawCapital = country?.capital?.capital ?? country?.capital;
  const capital = Array.isArray(rawCapital)
    ? rawCapital[0]
    : typeof rawCapital === "string"
      ? rawCapital
      : "N/A";

  // 4. Extract Population (nested under population.population)
  const rawPopulation = country?.population?.population ?? country?.population;
  const population =
    typeof rawPopulation === "number" ? rawPopulation.toLocaleString() : "N/A";

  const handleVisitClick = () => {
    const nextVisitedState = !visited;
    setVisited(nextVisitedState);
    if (onVisitedToggle) {
      onVisitedToggle(country, nextVisitedState);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Flag Image Container */}
        <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
          {flag ? (
            <img
              src={flag}
              alt={`${name} flag`}
              className="w-full h-full p-3 rounded-3xl object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              No Flag Available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-5">
          <h3
            className="text-lg font-bold text-slate-800 mb-3 truncate"
            title={name}
          >
            {name}
          </h3>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-500">Capital:</span>
              <span className="font-semibold text-slate-700 truncate max-w-30 text-right">
                {capital}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-500">Population:</span>
              <span className="font-semibold text-slate-700">{population}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button Action */}
      <div className="p-5 pt-0">
        <button
          type="button"
          onClick={handleVisitClick}
          className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl transition-all duration-200 border ${
            visited
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-slate-900 text-white hover:bg-slate-800 border-transparent shadow-sm"
          }`}
        >
          {visited ? "✓ Visited" : "Mark as Visited"}
        </button>
      </div>
    </div>
  );
}
