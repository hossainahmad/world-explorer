// src/components/CountryModal/CountryModal.tsx
import { useEffect, useRef, useState } from "react";
import countriesData from "world-countries"; // <-- New reliable library
import type { CountryType } from "../../type";
import LocalClock from "../LocalClock/LocalClock";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import {
  getFlagUrl,
  getName,
  getOfficialName,
  getCapital,
  getPopulation,
  getRegion,
  getSubregion,
  getLanguages,
  getCurrencies,
  getTimezones,
  getTld,
} from "../../utils/countryUtils";

interface CountryModalProps {
  country: CountryType | null;
  allCountries: CountryType[];
  onClose: () => void;
  onSelectCountry: (country: CountryType) => void;
}

export default function CountryModal({
  country,
  allCountries,
  onClose,
  onSelectCountry,
}: CountryModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [neighbors, setNeighbors] = useState<CountryType[]>([]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (country) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [country]);

  // Scroll to top when the country changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [country?.name?.common]);

  // Find neighbors using ISO codes from offline dataset
  useEffect(() => {
    if (!country) return;

    const raw = country as any;
    const countryName = raw?.name?.common;
    const countryCode =
      raw?.cca3?.cca3 || raw?.cca3 || raw?.cca2?.cca2 || raw?.cca2;

    if (!countryName && !countryCode) {
      setNeighbors([]);
      return;
    }

    // 1. Find the country in the offline dataset to get border ISO codes
    const matchedCountryData = countriesData.find((c) => {
      const matchesName =
        c.name.common.toLowerCase() === countryName?.toLowerCase();
      const matchesCode = c.cca3 === countryCode || c.cca2 === countryCode;
      return matchesName || matchesCode;
    });

    // 2. Extract the border codes (e.g., ["IND", "MMR"])
    const borderCodes = matchedCountryData?.borders || [];

    // 3. Match those codes with your API's country list
    const matchedNeighbors = borderCodes
      .map((code) => {
        return allCountries.find((c) => {
          const cca3 = (c as any)?.cca3?.cca3 || (c as any)?.cca3;
          const cca2 = (c as any)?.cca2?.cca2 || (c as any)?.cca2;
          return cca3 === code || cca2 === code;
        });
      })
      .filter((c): c is CountryType => c !== undefined);

    setNeighbors(matchedNeighbors);
  }, [country, allCountries]);

  if (!country) return null;

  const raw = country as any;

  const name = getName(raw);
  const officialName = getOfficialName(raw);
  const flag = getFlagUrl(raw);
  const capital = getCapital(raw);
  const population = getPopulation(raw);
  const region = getRegion(raw);
  const subregion = getSubregion(raw);
  const languages = getLanguages(raw);
  const currencies = getCurrencies(raw);
  const timezones = getTimezones(raw);
  const tld = getTld(raw);

  const latlng = raw?.latlng;
  const latitude =
    Array.isArray(latlng) && latlng.length >= 2 ? latlng[0] : null;
  const longitude =
    Array.isArray(latlng) && latlng.length >= 2 ? latlng[1] : null;

  const mapQuery = capital !== "N/A" ? `${capital}, ${name}` : name;
  const encodedQuery = encodeURIComponent(mapQuery);

  const embedUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=10&ie=UTF8&iwloc=&output=embed`;
  const externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        ref={scrollContainerRef}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Hero Section */}
        <div className="relative p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 rounded-t-3xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors z-10"
          >
            ✕
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {flag && (
              <img
                src={flag}
                alt={`${name} flag`}
                className="w-32 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-md"
              />
            )}
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {officialName}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-8">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1">
                Capital
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-base">
                {capital}
              </span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1">
                Population
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-base">
                {population}
              </span>
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LocalClock
                timezones={raw?.timezones?.timezones ?? raw?.timezones}
                capital={capital}
                cca2={raw?.cca2}
                countryName={name}
              />
              <WeatherWidget
                latitude={latitude}
                longitude={longitude}
                capital={capital}
                countryName={name}
              />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1">
                Region
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-base">
                {region} {subregion !== "N/A" ? `• ${subregion}` : ""}
              </span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1">
                Top Level Domain
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-base">
                {tld}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1">
                Languages
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-base">
                {languages}
              </span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1">
                Currencies
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-base">
                {currencies}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 sm:col-span-2">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider mb-1">
                Timezone(s)
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-base">
                {timezones}
              </span>
            </div>
          </div>

          {/* Neighboring Countries Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Bordering Countries
            </h3>

            {neighbors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {neighbors.map((neighbor) => {
                  const neighborName =
                    (neighbor as any)?.name?.common || "Unknown";
                  const neighborCode =
                    (neighbor as any)?.cca3?.cca3 ||
                    (neighbor as any)?.cca3 ||
                    neighborName;

                  return (
                    <button
                      key={neighborCode}
                      onClick={() => onSelectCountry(neighbor)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 flex items-center gap-2"
                    >
                      <span>🌍</span>
                      {neighborName}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center">
                  🏝️ Island Nation • No land borders
                </p>
              </div>
            )}
          </div>

          {/* Google Maps Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Location Map
              </h3>
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Open in Google Maps ↗
              </a>
            </div>
            <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
              <iframe
                title={`Map of ${mapQuery}`}
                width="100%"
                height="100%"
                frameBorder="0"
                src={embedUrl}
                loading="lazy"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
