const isProd = import.meta.env.MODE === "production";

export const CONSTANTS = Object.freeze({
  API_DOMAIN: isProd
    ? import.meta.env.VITE_API_DEV_URL
    : import.meta.env.VITE_API_PROD_URL,
  PAGINATION_LIMIT: import.meta.env.PAGINIATION_LIMIT
    ? import.meta.env.PAGINIATION_LIMIT
    : 5,
});
