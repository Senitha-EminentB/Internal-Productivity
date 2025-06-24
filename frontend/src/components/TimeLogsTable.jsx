import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Skeleton } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'userName', headerName: 'User', width: 150 },
  { field: 'taskTitle', headerName: 'Task', width: 250 },
  { field: 'hours', headerName: 'Hours', width: 100 },
  { field: 'date', headerName: 'Date', width: 180 },
];

export default function TimeLogsTable({ timeLogs, loading }) {
  return (
    <Box sx={{ height: 400, width: '100%', mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Time Logs</Typography>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <DataGrid rows={timeLogs} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
      )}
    </Box>
  );
} 