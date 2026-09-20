import { Suspense } from "react";
import "./App.css";
import type { CountryType } from "./type";
import Countries from "./components/Countries/Countries";

// Create a safe promise with fallback handling
const fetchCountries = async (): Promise<CountryType[]> => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/all");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.countries || data;
  } catch (err) {
    console.error("Primary API failed, trying REST Countries fallback...", err);
    // Fallback to standard REST Countries API if main server times out
    const fallbackRes = await fetch("https://restcountries.com/v3.1/all");
    const fallbackData = await fallbackRes.json();
    return fallbackData;
  }
};

// Store promise instance outside component to avoid redundant re-fetches
const countriesPromise = fetchCountries();

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Suspense
        fallback={
          <div className="p-8 text-center text-slate-600 font-medium">
            Loading countries...
          </div>
        }
      >
        <Countries countriesPromise={countriesPromise} />
      </Suspense>
    </div>
  );
}

export default App;
