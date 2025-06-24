import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Skeleton } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'userName', headerName: 'Author', width: 150 },
  { field: 'message', headerName: 'Message', width: 300 },
  { field: 'date', headerName: 'Date', width: 180 },
];

export default function CommitsTable({ commits, loading }) {
  return (
    <Box sx={{ height: 400, width: '100%', mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Commits</Typography>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <DataGrid rows={commits} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
      )}
    </Box>
  );
} 