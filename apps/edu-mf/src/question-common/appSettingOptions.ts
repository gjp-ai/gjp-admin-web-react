export const normalizeSettingValue = (value?: string | null) => String(value || '').trim().toLowerCase();

export const normalizeSettingLang = (value?: string | null) => {
  const normalized = normalizeSettingValue(value);
  if (normalized.startsWith('zh') || normalized === 'chinese') return 'zh';
  if (normalized.startsWith('en') || normalized === 'english') return 'en';
  return normalized;
};

export const getStoredAppSettingOptions = (
  settingName: string,
  channel?: string | null,
  lang?: string | null,
) => {
  const selectedChannel = normalizeSettingValue(channel);
  const selectedLang = normalizeSettingLang(lang);
  if (!settingName || !selectedChannel || !selectedLang) return [];

  try {
    const settings = localStorage.getItem('gjp_app_settings');
    if (!settings) return [];
    const parsed = JSON.parse(settings);
    const rows = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.content)
        ? parsed.content
        : Array.isArray(parsed?.data)
          ? parsed.data
          : Array.isArray(parsed?.data?.content)
            ? parsed.data.content
            : [];

    const matchingNameAndLang = rows.filter((setting: { name?: string; lang?: string }) => (
      normalizeSettingValue(setting.name) === normalizeSettingValue(settingName)
      && normalizeSettingLang(setting.lang) === selectedLang
    ));

    const matchingSettings = matchingNameAndLang.filter(
      (setting: { channel?: string | null }) => normalizeSettingValue(setting.channel) === selectedChannel,
    );
    const fallbackSettings = matchingNameAndLang.filter(
      (setting: { channel?: string | null }) => normalizeSettingValue(setting.channel) === 'all',
    );
    const blankChannelSettings = matchingNameAndLang.filter(
      (setting: { channel?: string | null }) => !normalizeSettingValue(setting.channel),
    );

    const selectedSettings = matchingSettings.length
      ? matchingSettings
      : fallbackSettings.length
        ? fallbackSettings
        : blankChannelSettings;

    return [...new Set<string>(selectedSettings
      .flatMap((setting: { value?: string }) => String(setting.value || '').split(/[,;\n]/))
      .map((option: string) => option.trim())
      .filter(Boolean))];
  } catch {
    return [];
  }
};
