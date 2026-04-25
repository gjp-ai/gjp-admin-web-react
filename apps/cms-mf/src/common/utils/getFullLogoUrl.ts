/**
 * Returns the full logo URL.
 * It handles absolute URLs, relative filenames, and normalizes backend URLs 
 * to use the '/api' proxy path for better reliability in different environments.
 * 
 * @param logoUrl The logo URL or filename stored in the database
 * @returns The normalized full URL for display
 */
export function getFullLogoUrl(logoUrl: string): string {
  if (!logoUrl) return '';

  let normalizedUrl = logoUrl;

  // 1. Handle absolute URLs from backend
  // If it points to our own backend (localhost or production), 
  // we want to use the /api relative path to go through the proxy.
  if (normalizedUrl.startsWith('http')) {
    // Replace localhost:8083/api or ganjianping.com/api with /api
    normalizedUrl = normalizedUrl.replace(/^https?:\/\/localhost:8083\/api/i, '/api');
    normalizedUrl = normalizedUrl.replace(/^https?:\/\/www\.ganjianping\.com\/api/i, '/api');

    if (normalizedUrl.startsWith('http')) return normalizedUrl;
  }

  // 2. Handle relative filenames using app settings (fallback)
  try {
    const settings = localStorage.getItem('gjp_app_settings');
    if (settings) {
      const appSettings = JSON.parse(settings);
      const logoBaseUrlSetting = appSettings.find(
        (setting: any) => setting.name === 'logo_base_url'
      );
      if (logoBaseUrlSetting && logoBaseUrlSetting.value) {
        let baseUrl = logoBaseUrlSetting.value;
        // Also normalize the base URL setting if it's absolute
        baseUrl = baseUrl.replace(/^https?:\/\/localhost:8083\/api/i, '/api');
        baseUrl = baseUrl.replace(/^https?:\/\/www\.ganjianping\.com\/api/i, '/api');

        return baseUrl + (baseUrl.endsWith('/') ? '' : '/') + normalizedUrl;
      }
    }
  } catch (err) {
    // Fallback if settings parsing fails
  }

  return normalizedUrl;
}
