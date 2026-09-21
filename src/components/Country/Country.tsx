import { useState } from "react";
import type { CountryType } from "../../type";

interface CountryProps {
  country: CountryType;
  onVisitedToggle?: (country: CountryType, isVisited: boolean) => void;
}

export default function Country({ country, onVisitedToggle }: CountryProps) {
  const [visited, setVisited] = useState(false);

  // Safe Property Extractors for Programming Hero & Standard REST APIs
  const name = country?.name?.common ?? "Unknown Country";

  const flag =
    (country as any)?.flags?.flags?.png ||
    (country as any)?.flags?.flags?.svg ||
    country?.flags?.png ||
    country?.flags?.svg ||
    "";

  const rawCapital = (country as any)?.capital?.capital ?? country?.capital;
  const capital = Array.isArray(rawCapital)
    ? rawCapital[0]
    : typeof rawCapital === "string"
      ? rawCapital
      : "N/A";

  const rawPopulation =
    (country as any)?.population?.population ?? country?.population;
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Flag Image */}
        <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
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
            className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 truncate"
            title={name}
          >
            {name}
          </h3>

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-500">Capital:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px] text-right">
                {capital}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-500">Population:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {population}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="p-5 pt-0">
        <button
          type="button"
          onClick={handleVisitClick}
          className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl transition-all duration-200 border ${
            visited
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm hover:bg-emerald-700"
              : "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 border-transparent shadow-sm"
          }`}
        >
          {visited ? "✓ Visited" : "Mark as Visited"}
        </button>
      </div>
    </div>
  );
}
