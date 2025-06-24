const generateInsights = (tasks, users, commits, bugs) => {
    if (!tasks.length || !users.length) {
        return [];
    }

    const insights = [];

    // Insight 1: Overall task completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = ((completedTasks / totalTasks) * 100).toFixed(2);
    insights.push(`Overall project completion rate is ${completionRate}%.`);

    if (completionRate > 75) {
        insights.push("Productivity is high. Keep up the great work!");
    } else if (completionRate < 40) {
        insights.push("Productivity is low. Identify blockers and support the team.");
    }

    // Insight 2: Most active user based on assigned tasks
    const taskCounts = users.map(user => {
        const userTasks = tasks.filter(task => task.userId === user.id);
        return { name: user.name, taskCount: userTasks.length, completedCount: userTasks.filter(t => t.completed).length };
    });

    if(taskCounts.length > 0) {
        const mostActiveUser = taskCounts.reduce((prev, current) => (prev.taskCount > current.taskCount) ? prev : current);
        insights.push(`${mostActiveUser.name} is the most active developer with ${mostActiveUser.taskCount} tasks assigned.`);
        
        // Insight 3: User with most completed tasks
        const mostCompletedUser = taskCounts.reduce((prev, current) => (prev.completedCount > current.completedCount) ? prev : current);
        insights.push(`${mostCompletedUser.name} has completed the most tasks (${mostCompletedUser.completedCount}).`);
    }

    // Insight 4: Top committer
    if (commits && commits.length > 0) {
        const commitCounts = users.map(user => ({
            name: user.name,
            commitCount: commits.filter(c => c.userId === user.id).length,
        }));

        if (commitCounts.length > 0) {
            const topCommitter = commitCounts.reduce((prev, current) => (prev.commitCount > current.commitCount) ? prev : current);
            if (topCommitter.commitCount > 0) {
                insights.push(`${topCommitter.name} is the top committer with ${topCommitter.commitCount} commits.`);
            }
        }
    }

    // Insight 5: Bug status
    if (bugs && bugs.length > 0) {
        const openBugs = bugs.filter(b => b.status === 'open').length;
        const highPriorityOpenBugs = bugs.filter(b => b.status === 'open' && b.priority === 'high').length;
        
        insights.push(`There are currently ${openBugs} open bugs.`);
        if (highPriorityOpenBugs > 0) {
            insights.push(`Warning: ${highPriorityOpenBugs} of them are high priority.`);
        }
    }

    return insights;
};

module.exports = {
    generateInsights,
}; 