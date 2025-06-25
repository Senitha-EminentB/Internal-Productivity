import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const IndividualView = ({ tasks, commits, bugs, timeLogs }) => {
    const { user } = useAuth();

    if (!user) {
        return <Typography>Please log in to see your individual stats.</Typography>;
    }

    const userTasks = tasks.filter(t => t.userId === user.id);
    const userCommits = commits.filter(c => c.userId === user.id);
    const userBugs = bugs.filter(b => b.assignedTo === user.id);
    const userTimeLogs = timeLogs.filter(tl => tl.userId === user.id);
    
    const totalHours = userTimeLogs.reduce((acc, log) => acc + parseFloat(log.hours), 0).toFixed(1);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">My Performance ({user.name})</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Tasks Completed</Typography>
                            <Typography variant="h4">{userTasks.filter(t => t.completed).length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Total Commits</Typography>
                            <Typography variant="h4">{userCommits.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Open Bugs</Typography>
                            <Typography variant="h4">{userBugs.filter(b => b.status === 'open').length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Total Hours Logged</Typography>
                            <Typography variant="h4">{totalHours}h</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default IndividualView; 