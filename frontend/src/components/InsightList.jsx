import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

export default function InsightList({ insights, loading }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>AI Insights</Typography>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={120} />
      ) : (
        <List>
          {insights.map((insight, idx) => (
            <ListItem key={idx}>
              <ListItemIcon>
                <LightbulbIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary={insight} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
} 