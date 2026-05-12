// Central API URL — uses NEXT_PUBLIC_API_URL in production,
// falls back to localhost:4000 in local development.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '');
