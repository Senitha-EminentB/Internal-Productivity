import { useEffect, useState } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  ButtonGroup, 
  Button,
  CircularProgress,
  Paper
} from '@mui/material';
import KpiCard from '../components/KpiCard';
import TaskChart from '../components/Charts/TaskChart';
import CommitsTable from '../components/CommitsTable';
import BugsTable from '../components/BugsTable';
import TimeLogsTable from '../components/TimeLogsTable';
import InsightList from '../components/InsightList';
import TeamView from '../components/TeamView';
import IndividualView from '../components/IndividualView';
import UserManagement from '../components/UserManagement';
import { getDashboardData, getInsights, exportReport } from '../services/api';
import { useAuth } from '../context/AuthContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 3, pt: 2 }}>
          <Paper elevation={0} sx={{ p: 2 }}>
            {children}
          </Paper>
        </Box>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ tasks: [], users: [], commits: [], bugs: [], timeLogs: [] });
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(''); // '', 'week', 'month'
  const [tabIndex, setTabIndex] = useState(0);

  const getAvailableTabs = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Overview', index: 0 },
        { label: 'Team View', index: 1 },
        { label: 'Individual View', index: 2 },
        { label: 'User Management', index: 3 }
      ];
    } else if (user?.role === 'manager') {
      return [
        { label: 'Overview', index: 0 },
        { label: 'Team View', index: 1 }
      ];
    } else {
      return [
        { label: 'Overview', index: 0 },
        { label: 'Individual View', index: 1 }
      ];
    }
  };

  const availableTabs = getAvailableTabs();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [dashboardRes, insightRes] = await Promise.all([
          getDashboardData(range),
          getInsights(),
        ]);
        setData(dashboardRes.data);
        setInsights(insightRes.data.insights);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [range]);

  const handleExport = (format) => {
    exportReport(format).catch(err => console.error(`Export failed:`, err));
  };

  const kpiMetrics = [
    { title: 'Tasks Completed', value: data.tasks.filter(t => t.completed).length },
    { title: 'Total Commits', value: data.commits.length },
    { title: 'Open Bugs', value: data.bugs.filter(b => b.status === 'open').length },
    { title: 'Hours Logged', value: data.timeLogs.reduce((acc, log) => acc + parseFloat(log.hours), 0).toFixed(1) + 'h' },
  ];

  const showInsights = user?.role === 'admin' || user?.role === 'manager';

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <ButtonGroup variant="outlined" size="medium">
            <Button 
              onClick={() => setRange('')} 
              variant={range === '' ? 'contained' : 'outlined'}
            >
              All Time
            </Button>
            <Button 
              onClick={() => setRange('week')} 
              variant={range === 'week' ? 'contained' : 'outlined'}
            >
              Week
            </Button>
            <Button 
              onClick={() => setRange('month')} 
              variant={range === 'month' ? 'contained' : 'outlined'}
            >
              Month
            </Button>
          </ButtonGroup>

          {(user?.role === 'admin' || user?.role === 'manager') && (
            <ButtonGroup variant="outlined" size="medium">
              <Button onClick={() => handleExport('csv')}>Export CSV</Button>
              <Button onClick={() => handleExport('pdf')}>Export PDF</Button>
            </ButtonGroup>
          )}
        </Box>
      </Box>
      
      {/* Tabs Section */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(e, newValue) => setTabIndex(newValue)} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          {availableTabs.map((tab) => (
            <Tab 
              key={tab.index} 
              label={tab.label} 
              sx={{ 
                py: 2,
                fontSize: '0.875rem',
                fontWeight: 600 
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={tabIndex} index={0}>
        {/* Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpiMetrics.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.title}>
              <KpiCard {...metric} loading={loading} />
            </Grid>
          ))}
        </Grid>
        
        {showInsights && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
              Key Insights
            </Typography>
            <InsightList insights={insights} loading={loading} />
          </Box>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
              Recent Commits
            </Typography>
            <CommitsTable commits={data.commits} loading={loading} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
              Bug Reports
            </Typography>
            <BugsTable bugs={data.bugs} loading={loading} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
              Time Logs
            </Typography>
            <TimeLogsTable timeLogs={data.timeLogs} loading={loading} />
          </Grid>
        </Grid>
      </TabPanel>

      {user?.role === 'admin' && (
        <TabPanel value={tabIndex} index={1}>
          <TeamView users={data.users} tasks={data.tasks} commits={data.commits} bugs={data.bugs} />
        </TabPanel>
      )}

      {user?.role === 'admin' && (
        <TabPanel value={tabIndex} index={2}>
          <IndividualView tasks={data.tasks} commits={data.commits} bugs={data.bugs} timeLogs={data.timeLogs} />
        </TabPanel>
      )}

      {user?.role === 'admin' && (
        <TabPanel value={tabIndex} index={3}>
          <UserManagement />
        </TabPanel>
      )}

      {user?.role === 'manager' && (
        <TabPanel value={tabIndex} index={1}>
          <TeamView users={data.users} tasks={data.tasks} commits={data.commits} bugs={data.bugs} />
        </TabPanel>
      )}

      {user?.role === 'developer' && (
        <TabPanel value={tabIndex} index={1}>
          <IndividualView tasks={data.tasks} commits={data.commits} bugs={data.bugs} timeLogs={data.timeLogs} />
        </TabPanel>
      )}
    </Box>
  );
}