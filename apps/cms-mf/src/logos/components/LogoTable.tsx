import { Box, Chip, Typography, Avatar } from '@mui/material';
import { Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Logo } from '../types/logo.types';
import { format, parseISO } from 'date-fns';
import { STATUS_MAPS } from '../constants';
import { LogoTableSkeleton } from './LogoTableSkeleton';
import { useLogoActionMenu } from '../hooks';
import { getFullLogoUrl } from '../../common/utils/getFullLogoUrl';

interface LogoTableProps {
  logos: Logo[];
  loading?: boolean;
  pagination?: any;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onLogoAction: (logo: Logo, action: 'view' | 'edit' | 'delete') => void;
  onCopyFilename?: (logo: Logo) => void;
}

// Column helper
const columnHelper = createColumnHelper<Logo>();

export const LogoTable = memo(({
  logos,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
  onLogoAction,
  onCopyFilename
}: LogoTableProps) => {
  const { t } = useTranslation();

  // Get action menu items from hook
  const actionMenuItems = useLogoActionMenu({
    onView: (logo: Logo) => onLogoAction(logo, 'view'),
    onEdit: (logo: Logo) => onLogoAction(logo, 'edit'),
    onDelete: (logo: Logo) => onLogoAction(logo, 'delete'),
    onCopyFilename: (logo: Logo) => onCopyFilename?.(logo),
  });

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('logos.columns.name'),
      cell: (info) => {
        const logo = info.row.original;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, flexShrink: 0 }}>
              {logo.fileUrl || logo.filename ? (
                <Avatar
                  src={getFullLogoUrl(logo.fileUrl || logo.filename)}
                  alt={info.getValue()}
                  sx={{
                    width: 40,
                    height: 40,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}
                  variant="rounded"
                />
              ) : (
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                  variant="rounded"
                >
                  <Image size={20} />
                </Avatar>
              )}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {info.getValue()}
            </Typography>
          </Box>
        );
      },
    }),
    columnHelper.accessor('extension', {
      header: t('logos.columns.extension'),
      cell: (info) => {
        const value = info.getValue();
        return (
          <Chip
            label={value || '-'}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem', height: 24, fontWeight: 600 }}
          />
        );
      },
    }),
    columnHelper.accessor('lang', {
      header: t('logos.columns.lang'),
      cell: (info) => (
        <Chip
          label={info.getValue()}
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.75rem', height: 24 }}
        />
      ),
    }),
    columnHelper.accessor('tags', {
      header: t('logos.columns.tags'),
      cell: (info) => {
        const tags = info.getValue();
        return (
          <Typography
            variant="body2"
            sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={tags}
          >
            {tags || '-'}
          </Typography>
        );
      },
    }),
    columnHelper.accessor('displayOrder', {
      header: t('logos.columns.displayOrder'),
      cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('isActive', {
      header: t('logos.columns.isActive'),
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {createStatusChip(isActive.toString(), STATUS_MAPS.active)}
          </Box>
        );
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: t('logos.columns.updatedAt'),
      cell: (info) => {
        const date = info.getValue();
        return date ? format(parseISO(date), 'MMM dd, yyyy') : '-';
      },
    }),
  ], [t]);

  // Show skeleton loader while loading
  if (loading && !logos.length) {
    return <LogoTableSkeleton rows={5} />;
  }

  // Show empty state
  if (!logos?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <Image size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('logos.noLogosFound')}
        </Typography>
      </Box>
    );
  }

  // Sort logos by updatedAt desc
  const sortedLogos = [...logos].sort((a, b) => {
    if (!a.updatedAt && !b.updatedAt) return 0;
    if (!a.updatedAt) return 1;
    if (!b.updatedAt) return -1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <DataTable
      data={sortedLogos}
      columns={columns}
      showSearch={false}
      onRowDoubleClick={(logo: Logo) => onLogoAction(logo, 'view')}
      manualPagination={!!pagination}
      pageCount={pagination?.totalPages || 0}
      currentPage={pagination?.page || 0}
      pageSize={pagination?.size || 50}
      totalRows={pagination?.totalElements || 0}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      actionMenuItems={actionMenuItems}
    />
  );
});

LogoTable.displayName = 'LogoTable';
