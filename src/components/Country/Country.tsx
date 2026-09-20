import { useState } from "react";
import type { CountryType } from "../../type";

interface CountryProps {
  country: CountryType;
  onVisitedToggle?: (country: CountryType, isVisited: boolean) => void;
}

export default function Country({ country, onVisitedToggle }: CountryProps) {
  const [visited, setVisited] = useState(false);

  // Safe mapping based on the Programming Hero API output
  const name = country?.name?.common ?? "Unknown Country";
  const flag = country?.flags?.png || country?.flags?.svg || "";
  const capital =
    Array.isArray(country?.capital) && country.capital.length > 0
      ? country.capital[0]
      : typeof country?.capital === "string"
        ? country.capital
        : "N/A";
  const population =
    typeof country?.population === "number"
      ? country.population.toLocaleString()
      : "N/A";

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
        {/* Flag Image */}
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          {flag ? (
            <img
              src={flag}
              alt={`${name} flag`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              No Flag Available
            </div>
          )}
        </div>

        {/* Content */}
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
              <span className="font-semibold text-slate-700 truncate max-w-[120px] text-right">
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

      {/* Visited Button */}
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
