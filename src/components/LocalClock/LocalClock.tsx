import { useEffect, useState } from "react";

interface LocalClockProps {
  timezones?: any;
  capital?: string;
  cca2?: unknown;
  countryName?: string;
}

const normalizeCountryCode = (value: unknown): string => {
  if (typeof value === "string") return value.trim().toUpperCase();

  if (value && typeof value === "object") {
    const maybeCode =
      "cca2" in value
        ? (value as { cca2?: unknown }).cca2
        : "code" in value
          ? (value as { code?: unknown }).code
          : undefined;

    if (typeof maybeCode === "string") {
      return maybeCode.trim().toUpperCase();
    }
  }

  return "";
};

// Fallback lookup mapping Country ISO Codes to IANA Timezones
const TIMEZONE_MAP: Record<string, string> = {
  BD: "Asia/Dhaka",
  BGD: "Asia/Dhaka",
  IN: "Asia/Kolkata",
  IND: "Asia/Kolkata",
  PK: "Asia/Karachi",
  PAK: "Asia/Karachi",
  JP: "Asia/Tokyo",
  JPN: "Asia/Tokyo",
  US: "America/New_York",
  USA: "America/New_York",
  GB: "Europe/London",
  GBR: "Europe/London",
  VU: "Pacific/Efate",
  VUT: "Pacific/Efate",
};

export default function LocalClock({
  timezones,
  capital,
  cca2,
  countryName,
}: LocalClockProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const code = normalizeCountryCode(cca2);
  let targetIana: string | undefined = TIMEZONE_MAP[code];
  let utcOffsetHours: number | null = null;

  // Extract from timezones parameter if targetIana is not mapped
  if (!targetIana && timezones) {
    const rawList = Array.isArray(timezones)
      ? timezones
      : typeof timezones === "string"
        ? [timezones]
        : typeof timezones === "object"
          ? Object.values(timezones)
          : [];

    for (const tz of rawList) {
      if (typeof tz !== "string") continue;
      const clean = tz.trim().toUpperCase();

      if (clean.includes("UTC") || clean.includes("GMT")) {
        const match = clean.match(
          /(?:UTC|GMT)?\s*([+-])(\d{1,2})(?::(\d{2}))?/i,
        );
        if (match) {
          const sign = match[1] === "+" ? 1 : -1;
          const hours = parseInt(match[2], 10);
          const mins = match[3] ? parseInt(match[3], 10) : 0;
          utcOffsetHours = sign * (hours + mins / 60);
          break;
        } else if (clean === "UTC" || clean === "GMT") {
          utcOffsetHours = 0;
          break;
        }
      }
    }
  }

  // Fallback by country name
  if (!targetIana && utcOffsetHours === null) {
    if (countryName?.toLowerCase().includes("bangladesh")) {
      targetIana = "Asia/Dhaka";
    } else {
      utcOffsetHours = 0; // Default UTC
    }
  }

  let formattedTime = "";
  let targetDate = new Date();

  // Format local clock time and compute target Date
  if (typeof targetIana === "string" && targetIana.length > 0) {
    try {
      const ianaString: string = targetIana;

      formattedTime = new Intl.DateTimeFormat("en-US", {
        timeZone: ianaString,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);

      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: ianaString,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      }).formatToParts(now);

      const p: Record<string, string> = {};
      parts.forEach((item) => (p[item.type] = item.value));

      targetDate = new Date(
        parseInt(p.year, 10),
        parseInt(p.month, 10) - 1,
        parseInt(p.day, 10),
        parseInt(p.hour === "24" ? "0" : p.hour, 10),
        parseInt(p.minute, 10),
        parseInt(p.second, 10),
      );
    } catch (e) {
      targetIana = undefined;
    }
  }

  if (!targetIana && utcOffsetHours !== null) {
    const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60000;
    targetDate = new Date(utcTimestamp + utcOffsetHours * 3600000);

    const hours = targetDate.getHours();
    const minutes = targetDate.getMinutes();
    const seconds = targetDate.getSeconds();

    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

    formattedTime = `${displayHours}:${displayMinutes}:${displaySeconds} ${ampm}`;
  }

  // Calculate time difference relative to user
  const diffTimeMs = targetDate.getTime() - now.getTime();
  const diffHours = Math.round((diffTimeMs / 3600000) * 10) / 10;

  let badgeText = "Same time as you";
  if (diffHours > 0.1) {
    badgeText = `+${diffHours} hrs ahead of you`;
  } else if (diffHours < -0.1) {
    badgeText = `${Math.abs(diffHours)} hrs behind you`;
  }

  return (
    <div className="flex flex-col gap-1 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400 font-medium truncate">
          Local Time {capital && capital !== "N/A" ? `(${capital})` : ""}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
            badgeText === "Same time as you"
              ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              : diffHours > 0
                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                : "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300"
          }`}
        >
          {badgeText}
        </span>
      </div>

      <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tracking-wide mt-1">
        {formattedTime}
      </div>
    </div>
  );
}
