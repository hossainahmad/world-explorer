import { use, useState } from "react";
import type { CountryType } from "../../type";
import Country from "../Country/Country";
import WorldMap from "../WorldMap/WorldMap";

interface CountriesProps {
  countriesPromise: Promise<CountryType[]>;
}

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

// Fuzzy name normalization to fix map-to-country API naming mismatches
const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/(unitedstatesofamerica|unitedstates)/g, "usa")
    .replace(/(republicof|democraticrepublicof|the)/g, "");
};

export default function Countries({ countriesPromise }: CountriesProps) {
  const countries = use(countriesPromise);
  const [visitedList, setVisitedList] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const handleVisitedToggle = (country: CountryType, isVisited: boolean) => {
    const name = country?.name?.common;
    if (!name) return;

    setVisitedList((prev) =>
      isVisited ? [...prev, name] : prev.filter((c) => c !== name),
    );
  };

  // Safe search and region filtering logic
  const filteredCountries = countries.filter((country: any) => {
    const apiName = country?.name?.common || "";

    const rawCapital = country?.capital?.capital ?? country?.capital;
    const capital = Array.isArray(rawCapital)
      ? rawCapital[0] || ""
      : typeof rawCapital === "string"
        ? rawCapital
        : "";

    const region = country?.region?.region || country?.region || "";

    const query = searchQuery.toLowerCase().trim();
    const normalizedQuery = normalizeName(query);
    const normalizedApiName = normalizeName(apiName);

    // Check direct search match or normalized fuzzy match for map clicks
    const matchesSearch =
      query === "" ||
      apiName.toLowerCase().includes(query) ||
      capital.toLowerCase().includes(query) ||
      normalizedApiName.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedApiName);

    const matchesRegion =
      selectedRegion === "All" ||
      region.toLowerCase() === selectedRegion.toLowerCase();

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            World Explorer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore countries, flags, and keep track of places you have visited.
          </p>
        </div>

        {/* Search Bar & Counter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or capital..."
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            Visited:{" "}
            <span className="ml-2 px-2.5 py-0.5 bg-indigo-600 text-white rounded-md text-xs font-bold">
              {visitedList.length}
            </span>
          </div>
        </div>
      </div>

      {/* Region Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {REGIONS.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 border ${
              selectedRegion === region
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Interactive Bright World Map */}
      <WorldMap
        visitedCountries={visitedList}
        onCountryClick={(countryName) => setSearchQuery(countryName)}
      />

      {/* Country Cards Grid */}
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
        <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
            No countries found matching your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRegion("All");
            }}
            className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
