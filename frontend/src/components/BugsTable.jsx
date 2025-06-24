import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Skeleton } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 250 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'priority', headerName: 'Priority', width: 120 },
  { field: 'assignedToName', headerName: 'Assigned To', width: 150 },
  { field: 'createdAt', headerName: 'Created At', width: 180 },
];

export default function BugsTable({ bugs, loading }) {
  return (
    <Box sx={{ height: 400, width: '100%', mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Bugs</Typography>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <DataGrid rows={bugs} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
      )}
    </Box>
  );
} 