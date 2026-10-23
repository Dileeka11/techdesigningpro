// "Lite" mode for low-end devices. The class is set before first paint by the
// inline script in layout.tsx (few CPU cores / little RAM / Save-Data), and can
// be switched on later by a 3D scene that measures a low frame rate. CSS uses
// html.lite to drop the expensive effects (backdrop blur, grain, blur reveals).

export const LITE_EVENT = "tdp:lite";

/** Runs in <head> before anything renders. Keep it tiny and dependency-free. */
export const LITE_DETECT_SCRIPT =
  "try{var n=navigator,c=n.connection||{},h=n.hardwareConcurrency,m=n.deviceMemory;" +
  "if((h&&h<=4)||(m&&m<=4)||c.saveData||/2g/.test(c.effectiveType||''))document.documentElement.classList.add('lite')}catch(e){}";

export function isLite() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("lite");
}

export function markLite() {
  if (isLite()) return;
  document.documentElement.classList.add("lite");
  window.dispatchEvent(new Event(LITE_EVENT));
}
