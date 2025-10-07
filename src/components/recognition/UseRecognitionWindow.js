"use client";
import { useMemo, useCallback } from "react";

const ENV_TZ    = process.env.NEXT_PUBLIC_RECOG_TZ ?? "America/Mexico_City";
const ENV_OPEN  = process.env.NEXT_PUBLIC_RECOG_START_ISO;
const ENV_CLOSE = process.env.NEXT_PUBLIC_RECOG_END_ISO;

function parseISO(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function useRecognitionWindow({
  startISO = ENV_OPEN,
  endISO   = ENV_CLOSE,
  tz       = ENV_TZ,
  nowOverride,
} = {}) {
  const start = useMemo(() => parseISO(startISO), [startISO]);
  const end   = useMemo(() => parseISO(endISO),   [endISO]);
  const timeZone = tz;

  // <-- clave: `now` memoizado, solo cambia si cambia el override
  const now = useMemo(
    () => (nowOverride instanceof Date ? nowOverride : new Date()),
    [nowOverride]
  );

  const invalid = useMemo(() => !start || !end, [start, end]);

  const status = useMemo(() => {
    if (invalid) return "invalid";
    const n = now.getTime();
    if (n < start.getTime()) return "not-started";
    if (n > end.getTime())   return "expired";
    return "open";
  }, [invalid, now, start, end]);

  const fmt = useCallback((dt) => {
    if (!dt) return "—";
    return new Intl.DateTimeFormat("es-MX", {
      timeZone,
      dateStyle: "long",
      timeStyle: "short",
    }).format(dt);
  }, [timeZone]);

  return {
    status, start, end, now, timeZone,
    startMs: start?.getTime() ?? NaN,
    endMs:   end?.getTime()   ?? NaN,
    fmt,
    isOpen: status === "open",
    isExpired: status === "expired",
    isNotStarted: status === "not-started",
    isInvalid: status === "invalid",
  };
}
