import { apiClient } from "../../../../shared-lib/src/api/api-client";
import type { PaginatedResponse } from "../../../../shared-lib/src/api/api.types";

export interface AppSetting {
  name: string;
  value: string;
  lang: string;
}

export interface AppSettingsResponse {
  status: {
    code: number;
    message: string;
    errors: null | Record<string, string[]>;
  };
  data: AppSetting[];
  meta: {
    serverDateTime: string;
    requestId: string;
    sessionId: string;
  };
}

class AppSettingsService {
  /**
   * Fetch public app settings
   */
  public async fetchAppSettings(): Promise<AppSetting[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<AppSetting>>(
        "/v1/app-settings",
      );

      if (response.status.code === 200 && response.data) {
        // The endpoint returns a paginated response — extract the content array
        const settings = Array.isArray(response.data)
          ? (response.data as unknown as AppSetting[])
          : response.data.content ?? [];

        // Store in localStorage
        localStorage.setItem(
          "gjp_app_settings",
          JSON.stringify(settings),
        );
        return settings;
      } else {
        throw new Error("Failed to fetch app settings");
      }
    } catch (error) {
      console.error("[AppSettingsService] Fetch error:", error);
      throw error;
    }
  }

  /**
   * Get app settings from localStorage
   */
  public getAppSettings(): AppSetting[] | null {
    try {
      const raw = localStorage.getItem("gjp_app_settings");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Guard against stale paginated object being stored in localStorage
      if (Array.isArray(parsed)) return parsed as AppSetting[];
      if (parsed && Array.isArray(parsed.content)) return parsed.content as AppSetting[];
      return null;
    } catch (error) {
      console.error("[AppSettingsService] Get settings error:", error);
      return null;
    }
  }

  /**
   * Get app settings filtered by language
   */
  public getAppSettingsByLanguage(language: string): Record<string, string> {
    const settings = this.getAppSettings();
    if (!settings) return {};

    const normalizedLang = language.toUpperCase().startsWith("ZH")
      ? "ZH"
      : "EN";

    return settings
      .filter((setting) => setting.lang === normalizedLang)
      .reduce(
        (acc, setting) => {
          acc[setting.name] = setting.value;
          return acc;
        },
        {} as Record<string, string>,
      );
  }
}

export const appSettingsService = new AppSettingsService();
export default appSettingsService;
