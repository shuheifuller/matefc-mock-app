/** Environment label (e.g. "BETA", "UAT") shown as an on-screen badge.
 *  Set at build time via VITE_ENV_LABEL; undefined → no badge. */
export const ENV_LABEL = import.meta.env.VITE_ENV_LABEL as string | undefined;
