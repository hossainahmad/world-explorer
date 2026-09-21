import { use, useState } from "react";
import type { CountryType } from "../../type";
import Country from "../Country/Country";

interface CountriesProps {
  countriesPromise: Promise<CountryType[]>;
}

export default function Countries({ countriesPromise }: CountriesProps) {
  const countries = use(countriesPromise);
  const [visitedCount, setVisitedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleVisitedToggle = (_country: CountryType, isVisited: boolean) => {
    setVisitedCount((prev) => (isVisited ? prev + 1 : prev - 1));
  };

  // Filter countries based on search query (checks common name & capital)
  const filteredCountries = countries.filter((country: any) => {
    const name = country?.name?.common?.toLowerCase() || "";

    // Safely extract capital string
    const rawCapital = country?.capital?.capital ?? country?.capital;
    const capital = Array.isArray(rawCapital)
      ? rawCapital[0]?.toLowerCase() || ""
      : typeof rawCapital === "string"
        ? rawCapital.toLowerCase()
        : "";

    const query = searchQuery.toLowerCase().trim();
    return name.includes(query) || capital.includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            World Explorer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore countries, flags, and keep track of places you have visited.
          </p>
        </div>

        {/* Search Bar & Counter Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input Box */}
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              🔍
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or capital..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Visited Counter Badge */}
          <div className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            Visited Countries:{" "}
            <span className="ml-2 px-2.5 py-0.5 bg-indigo-600 text-white rounded-md text-xs font-bold">
              {visitedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {filteredCountries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map((country: any, idx: number) => {
            const uniqueKey =
              country?.cca3?.cca3 ||
              country?.cca3 ||
              `${country?.name?.common}-${idx}`;

            return (
              <Country
                key={uniqueKey}
                country={country}
                onVisitedToggle={handleVisitedToggle}
              />
            );
          })}
        </div>
      ) : (
        /* Empty Search Result State */
        <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
            No countries found matching "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
