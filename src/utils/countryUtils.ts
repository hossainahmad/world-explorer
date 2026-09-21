// src/utils/countryUtils.ts

export const getFlagUrl = (country: any): string => {
  return (
    country?.flags?.flags?.png ||
    country?.flags?.flags?.svg ||
    country?.flags?.png ||
    country?.flags?.svg ||
    ""
  );
};

export const getName = (country: any): string => {
  return country?.name?.common ?? "Unknown Country";
};

export const getOfficialName = (country: any): string => {
  return country?.name?.official ?? getName(country);
};

export const getCapital = (country: any): string => {
  const rawCapital = country?.capital?.capital ?? country?.capital;
  if (Array.isArray(rawCapital)) return rawCapital[0] || "N/A";
  if (typeof rawCapital === "string") return rawCapital;
  return "N/A";
};

export const getPopulation = (country: any): string => {
  const rawPop = country?.population?.population ?? country?.population;
  return typeof rawPop === "number" ? rawPop.toLocaleString() : "N/A";
};

export const getRegion = (country: any): string => {
  return country?.region?.region || country?.region || "N/A";
};

export const getSubregion = (country: any): string => {
  return country?.subregion || country?.region?.subregion || "N/A";
};

export const getLanguages = (country: any): string => {
  const langs = country?.languages?.languages ?? country?.languages;
  if (!langs) return "N/A";

  let parsed: string[] = [];
  if (Array.isArray(langs)) {
    parsed = langs.map((l: any) =>
      typeof l === "object" ? l.name || l.common : l,
    );
  } else if (typeof langs === "object") {
    parsed = Object.values(langs).map((l: any) =>
      typeof l === "object" ? l.name || l.common : l,
    );
  } else if (typeof langs === "string" && langs.trim() !== "[object Object]") {
    return langs;
  }

  const filtered = parsed.filter(Boolean);
  return filtered.length > 0 ? filtered.join(", ") : "N/A";
};

export const getCurrencies = (country: any): string => {
  const curr = country?.currencies?.currencies ?? country?.currencies;
  if (!curr) return "N/A";

  let parsed: string[] = [];
  const parseCurrencyItem = (c: any) => {
    if (typeof c === "string") return c;
    const cName = c?.name || c?.code || "";
    const symbol = c?.symbol ? ` (${c.symbol})` : "";
    return `${cName}${symbol}`.trim();
  };

  if (Array.isArray(curr)) {
    parsed = curr.map(parseCurrencyItem);
  } else if (typeof curr === "object") {
    parsed = Object.values(curr).map(parseCurrencyItem);
  } else if (typeof curr === "string" && !curr.includes("undefined")) {
    return curr;
  }

  const filtered = parsed.filter((s) => s.length > 0 && s !== "()");
  return filtered.length > 0 ? filtered.join(", ") : "N/A";
};

export const getTimezones = (country: any): string => {
  const tz = country?.timezones?.timezones ?? country?.timezones;
  if (Array.isArray(tz) && tz.length > 0) return tz.join(", ");
  if (typeof tz === "string" && tz !== "N/A" && tz.trim() !== "") return tz;
  return "UTC (Standard Time)";
};

export const getTld = (country: any): string => {
  const domain = country?.tld?.tld ?? country?.tld;
  if (Array.isArray(domain) && domain.length > 0) return domain.join(", ");
  if (typeof domain === "string" && domain.startsWith(".")) return domain;

  const cca2 = country?.cca2?.cca2 || country?.cca2;
  if (typeof cca2 === "string" && cca2.trim().length === 2) {
    return `.${cca2.toLowerCase()}`;
  }
  return "N/A";
};

export const getBorders = (country: any): string[] => {
  const borders = country?.borders?.borders ?? country?.borders;
  if (Array.isArray(borders)) return borders;
  return [];
};
