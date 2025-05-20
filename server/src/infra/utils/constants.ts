const isProd = process.env.NODE_ENV === "production";

export const CONSTANTS = Object.freeze({
  API_DOMAIN: isProd ? process.env.API_DEV_URL : process.env.API_PROD_URL,
  PAGINATION_LIMIT: parseInt(process.env.PAGINATION_LIMIT || "5", 10),
  PAGINATION_PAGE: parseInt(process.env.PAGINATION_PAGE || "1", 10),
});
