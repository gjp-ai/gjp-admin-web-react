interface AppSettingWithChannel {
  name: string;
  value: string;
  lang: string;
  channel?: string;
}

export function getCurrentAppSettingLang(language: string): string {
  return language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
}

export function getAppSettingTags(
  settingName: string,
  language: string,
  channel?: string,
): string[] {
  if (!channel) return [];

  try {
    const settings = localStorage.getItem('gjp_app_settings');
    if (!settings) return [];

    const appSettings = JSON.parse(settings) as AppSettingWithChannel[];
    const currentLang = getCurrentAppSettingLang(language);
    const tagSetting = appSettings.find(
      (setting) =>
        setting.name === settingName &&
        setting.lang === currentLang &&
        setting.channel === channel,
    );

    if (!tagSetting) return [];

    return tagSetting.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  } catch (error) {
    console.error('[appSettingsTags] Error loading tags:', error);
    return [];
  }
}
