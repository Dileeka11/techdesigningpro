"use client";

import { useEffect, useState } from "react";
import { LITE_EVENT, isLite } from "./perf";

/** Current lite state; re-renders if a scene switches lite mode on later. Client-only components. */
export function useLite() {
  const [lite, setLite] = useState(isLite);
  useEffect(() => {
    const on = () => setLite(true);
    window.addEventListener(LITE_EVENT, on);
    return () => window.removeEventListener(LITE_EVENT, on);
  }, []);
  return lite;
}
