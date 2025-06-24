import { Card, CardContent, Typography, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function KpiCard({ title, value, trend, loading }) {
  return (
    <Card>
      <CardContent>
        <Typography color="text.secondary">{title}</Typography>
        {loading ? (
          <Skeleton variant="text" width={60} height={40} />
        ) : (
          <Typography variant="h4">{value}</Typography>
        )}
        {trend === 'up' ? (
          <TrendingUpIcon color="success" />
        ) : trend === 'down' ? (
          <TrendingDownIcon color="error" />
        ) : null}
      </CardContent>
    </Card>
  );
}