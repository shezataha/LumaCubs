/* LumaCubs runtime config — override without rebuilding the app */
window.LUMACUBS_CONFIG = window.LUMACUBS_CONFIG || {
  // New platform API (backend/public)
  foundationApi: "http://127.0.0.1:8081",
  // Legacy player API (root api.php) — relative for same-origin
  legacyApi: "api.php",
  // Preferred UI language for catalog titles
  catalogLang: "en",
};