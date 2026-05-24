import { useSearch } from '../../../../shared-lib/src/data-management';
import type { AppSetting, AppSettingSearchFormData } from '../types/app-setting.types';

export const useAppSettingSearch = (allAppSettings: AppSetting[]) => {
  return useSearch<AppSetting, AppSettingSearchFormData>({
    allItems: allAppSettings,
    initialFormData: {
      name: '',
      lang: '',
      channel: '',
      isSystem: '',
      isPublic: '',
    },
    filterFunction: (items, filters) => {
      let filtered = [...items];

      // Filter by name (case-insensitive)
      if (filters.name) {
        filtered = filtered.filter(setting => 
          setting.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      // Filter by language (case-insensitive)
      if (filters.lang) {
        filtered = filtered.filter(setting => 
          setting.lang.toLowerCase().includes(filters.lang.toLowerCase())
        );
      }

      if (filters.channel) {
        filtered = filtered.filter(setting =>
          setting.channel?.toLowerCase().includes(filters.channel.toLowerCase())
        );
      }

      // Filter by isSystem status
      if (filters.isSystem !== '') {
        const isSystem = filters.isSystem === 'true';
        filtered = filtered.filter(setting => setting.isSystem === isSystem);
      }

      // Filter by isPublic status
      if (filters.isPublic !== '') {
        const isPublic = filters.isPublic === 'true';
        filtered = filtered.filter(setting => setting.isPublic === isPublic);
      }

      return filtered;
    },
  });
};
