import { Suspense } from "react";
import "./App.css";
import type { CountryType } from "./type";
import Countries from "./components/Countries/Countries";

const fetchCountries = async (): Promise<CountryType[]> => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/all");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.countries || data;
  } catch (err) {
    console.error("Primary API failed, attempting fallback...", err);
    const fallbackRes = await fetch("https://restcountries.com/v3.1/all");
    return await fallbackRes.json();
  }
};

const countriesPromise = fetchCountries();

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen text-slate-500 font-semibold text-sm">
            Loading World Explorer...
          </div>
        }
      >
        <Countries countriesPromise={countriesPromise} />
      </Suspense>
    </div>
  );
}

export default App;
