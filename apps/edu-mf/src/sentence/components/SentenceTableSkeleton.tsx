import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const SentenceTableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <TableContainer component={Paper} variant="outlined">
    <Table>
      <TableHead>
        <TableRow>
          {Array.from({ length: 8 }).map((_, index) => (
            <TableCell key={`sentence-skeleton-head-${index}`}>
              <Skeleton variant="text" width={120} />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={`sentence-skeleton-row-${index}`}>
            {Array.from({ length: 8 }).map((__, cellIndex) => (
              <TableCell key={`sentence-skeleton-cell-${index}-${cellIndex}`}>
                <Skeleton variant="text" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default SentenceTableSkeleton;
