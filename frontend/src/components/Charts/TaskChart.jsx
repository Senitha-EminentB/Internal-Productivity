import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Skeleton, Box } from '@mui/material';

// Register the components you'll use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TaskChart({ data, loading }) {
  if (loading) {
    return <Box sx={{ width: '100%', height: 300 }}><Skeleton variant="rectangular" width="100%" height={300} /></Box>;
  }
  return <Bar data={data} options={{
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weekly Task Completion' },
    },
  }} />;
}