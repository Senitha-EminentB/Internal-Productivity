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
        return { 
            name: user.name, 
            taskCount: userTasks.length, 
            completedCount: userTasks.filter(t => t.completed).length 
        };
    });

    if(taskCounts.length > 0) {
        const mostActiveUser = taskCounts.reduce((prev, current) => 
            (prev.taskCount > current.taskCount) ? prev : current);
        insights.push(`${mostActiveUser.name} is the most active developer with ${mostActiveUser.taskCount} tasks assigned.`);
        
        // Insight 3: User with most completed tasks
        const mostCompletedUser = taskCounts.reduce((prev, current) => 
            (prev.completedCount > current.completedCount) ? prev : current);
        insights.push(`${mostCompletedUser.name} has completed the most tasks (${mostCompletedUser.completedCount}).`);
    }

    // Insight 4: Top committer
    if (commits && commits.length > 0) {
        const commitCounts = users.map(user => ({
            name: user.name,
            commitCount: commits.filter(c => c.userId === user.id).length,
        }));

        if (commitCounts.length > 0) {
            const topCommitter = commitCounts.reduce((prev, current) => 
                (prev.commitCount > current.commitCount) ? prev : current);
            if (topCommitter.commitCount > 0) {
                insights.push(`${topCommitter.name} is the top committer with ${topCommitter.commitCount} commits.`);
            }
        }

        // Insight 5: Sudden drop in commits
        const recentCommits = commits.filter(c => 
            new Date(c.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
        const olderCommits = commits.filter(c => 
            new Date(c.date) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && 
            new Date(c.date) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)).length;
        
        if (olderCommits > 0 && (recentCommits / olderCommits) < 0.5) {
            insights.push("Productivity Alert: There has been a significant drop in commit frequency this week.");
        }
    }

    // Insight 6: Bug status
    if (bugs && bugs.length > 0) {
        const openBugs = bugs.filter(b => b.status === 'open').length;
        const highPriorityOpenBugs = bugs.filter(b => 
            b.status === 'open' && b.priority === 'high').length;
        
        insights.push(`There are currently ${openBugs} open bugs.`);
        if (highPriorityOpenBugs > 0) {
            insights.push(`Warning: ${highPriorityOpenBugs} of them are high priority.`);
        }

        // Insight 7: Recommend focus areas
        const openBugsByUser = users.map(user => ({
            name: user.name,
            highPriorityBugs: bugs.filter(b => 
                b.assignedTo === user.id && 
                b.status === 'open' && 
                b.priority === 'high').length
        }));
        
        const userWithMostBugs = openBugsByUser.reduce((prev, current) => 
            (prev.highPriorityBugs > current.highPriorityBugs) ? prev : current, 
            { highPriorityBugs: 0 });
            
        if (userWithMostBugs.highPriorityBugs > 1) {
            insights.push(`Focus Recommendation: ${userWithMostBugs.name} should focus on resolving their ${userWithMostBugs.highPriorityBugs} high-priority open bugs.`);
        }
    }

    // Insight 2.5: Tasks at risk of missing deadlines
    const now = new Date();
    const atRiskTasks = tasks.filter(task => !task.completed && task.deadline && (new Date(task.deadline) - now < 3 * 24 * 60 * 60 * 1000) && (new Date(task.deadline) - now > 0));
    if (atRiskTasks.length > 0) {
        insights.push(`There are ${atRiskTasks.length} tasks at risk of missing their deadlines (due in 3 days or less).`);
    }
    // Recommend user with most at-risk tasks
    if (atRiskTasks.length > 0) {
        const atRiskByUser = users.map(user => ({
            name: user.name,
            count: atRiskTasks.filter(t => t.userId === user.id).length
        }));
        const userMostAtRisk = atRiskByUser.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), { count: 0 });
        if (userMostAtRisk.count > 0) {
            insights.push(`Focus Recommendation: ${userMostAtRisk.name} has the most at-risk tasks (${userMostAtRisk.count}).`);
        }
    }

    return insights;
};

module.exports = {
    generateInsights,
};