import { Box, Typography } from '@mui/material';

interface RichHtmlViewProps {
  value?: unknown;
}

const RichHtmlView = ({ value }: RichHtmlViewProps) => {
  const html = String(value || '').trim();
  if (!html) return <Typography>-</Typography>;

  return (
    <Box
      sx={{
        '& p': { m: 0, mb: 0.75 },
        '& p:last-child': { mb: 0 },
        '& ul, & ol': { mt: 0, mb: 0.75, pl: 3 },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichHtmlView;
