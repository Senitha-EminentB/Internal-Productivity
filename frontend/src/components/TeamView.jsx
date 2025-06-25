import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const TeamView = ({ users, tasks, commits, bugs }) => {
    if (!users || users.length === 0) {
        return <Typography>No team data available.</Typography>;
    }

    const teamData = users.map(user => {
        const userTasks = tasks.filter(t => t.userId === user.id);
        const userCommits = commits.filter(c => c.userId === user.id);
        const userBugs = bugs.filter(b => b.assignedTo === user.id);
        return {
            name: user.name,
            tasksCompleted: userTasks.filter(t => t.completed).length,
            commits: userCommits.length,
            bugsAssigned: userBugs.length,
        };
    });

    const chartData = {
        labels: teamData.map(u => u.name),
        datasets: [
            {
                label: 'Tasks Completed',
                data: teamData.map(u => u.tasksCompleted),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Commits',
                data: teamData.map(u => u.commits),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Bugs Assigned',
                data: teamData.map(u => u.bugsAssigned),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    return (
        <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6">Team Performance</Typography>
            <Bar data={chartData} options={{ responsive: true }} />
        </Paper>
    );
};

export default TeamView; 