// Central API base URL.
// In Docker: VITE_API_URL=http://backend:5000 (set in docker-compose.yml)
// Local dev:  falls back to http://127.0.0.1:5000
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export default API_BASE;
