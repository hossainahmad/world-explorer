// src/components/Countries/Countries.tsx
import { use, useState } from "react";
import type { CountryType } from "../../type";
import Country from "../Country/Country";
import WorldMap from "../WorldMap/WorldMap";
import CountryModal from "../CountryModal/CountryModal";

interface CountriesProps {
  countriesPromise: Promise<CountryType[]>;
}

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/(unitedstatesofamerica|unitedstates)/g, "usa")
    .replace(/(republicof|democraticrepublicof|the)/g, "");
};

export default function Countries({ countriesPromise }: CountriesProps) {
  const rawCountries = use(countriesPromise);

  // Guard clause to ensure countries is always an array
  const countries = Array.isArray(rawCountries) ? rawCountries : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [activeCountry, setActiveCountry] = useState<CountryType | null>(null);

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            World Explorer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore countries, flags, capitals, currencies, and interactive
            maps.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative sm:w-72">
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

      {/* World Map */}
      <WorldMap onCountryClick={(countryName) => setSearchQuery(countryName)} />

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
                onSelectCountry={setActiveCountry}
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
            type="button"
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

      {/* Detailed View Modal */}
      <CountryModal
        country={activeCountry}
        allCountries={countries} // <-- Pass the full list for neighbor lookup
        onClose={() => setActiveCountry(null)}
        onSelectCountry={setActiveCountry} // <-- Allow modal to switch countries
      />
    </div>
  );
}
