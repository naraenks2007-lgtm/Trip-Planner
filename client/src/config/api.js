// API base URL strategy:
// - In Docker dev:  Vite proxy forwards /api/* → backend:5000 (Docker-internal)
// - Local dev:      Vite proxy forwards /api/* → localhost:5000
// The browser always uses a relative path — never a hard-coded host.
const API_BASE = '';   // empty = use Vite proxy (relative /api/... URLs)

export default API_BASE;
