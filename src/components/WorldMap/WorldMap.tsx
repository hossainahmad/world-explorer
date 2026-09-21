import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  onCountryClick?: (countryName: string) => void;
  visitedCountries?: string[];
}

const CONTINENTS = [
  { name: "NORTH AMERICA", coordinates: [-100, 45] },
  { name: "SOUTH AMERICA", coordinates: [-60, -15] },
  { name: "EUROPE", coordinates: [20, 55] },
  { name: "AFRICA", coordinates: [20, 5] },
  { name: "ASIA", coordinates: [90, 45] },
  { name: "OCEANIA", coordinates: [135, -25] },
  { name: "ANTARCTICA", coordinates: [0, -75] },
];

export default function WorldMap({
  onCountryClick,
  visitedCountries = [],
}: WorldMapProps) {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-700/60 rounded-2xl p-4 overflow-hidden shadow-xl mb-8 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
          Interactive World Map
        </h2>
        <span className="text-[11px] text-slate-400">
          💡 Click a country to highlight or filter
        </span>
      </div>

      <div className="w-full aspect-[2/1] max-h-[420px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 140 }}
          className="w-full h-full"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties?.name ?? "Unknown";
                const isVisited = visitedCountries.some(
                  (v) => v.toLowerCase() === countryName.toLowerCase(),
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (onCountryClick && countryName !== "Unknown") {
                        onCountryClick(countryName);
                      }
                    }}
                    style={
                      {
                        default: {
                          fill: isVisited ? "#10B981" : "#E2E8F0",
                          stroke: "#0F172A",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 200ms ease",
                        },
                        hover: {
                          fill: "#6366F1",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#4338CA",
                          outline: "none",
                        },
                      } as any
                    }
                  />
                );
              })
            }
          </Geographies>

          {CONTINENTS.map(({ name, coordinates }) => (
            <Marker key={name} coordinates={coordinates as [number, number]}>
              <text
                textAnchor="middle"
                className="fill-indigo-300/80 text-[10px] sm:text-[11px] font-black tracking-widest select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "sans-serif" }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}
