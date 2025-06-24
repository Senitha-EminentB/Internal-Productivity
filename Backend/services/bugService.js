const { getUsers } = require('./projectDataService');

const generateMockBugs = async () => {
    const users = await getUsers();
    const bugs = [];
    const titles = [
        "UI glitch on dashboard page",
        "API endpoint returning 500 error",
        "User cannot reset password",
        "Data export fails for large datasets",
        "Mobile view is not responsive"
    ];
    const statuses = ['open', 'in-progress', 'closed'];
    const priorities = ['low', 'medium', 'high'];

    for (let i = 1; i <= 20; i++) {
        const reporter = users[Math.floor(Math.random() * users.length)];
        const assignee = users[Math.floor(Math.random() * users.length)];
        bugs.push({
            id: i,
            title: titles[Math.floor(Math.random() * titles.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            reportedBy: reporter.id,
            reportedByName: reporter.name,
            assignedTo: assignee.id,
            assignedToName: assignee.name,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
        });
    }
    return bugs;
};

module.exports = { generateMockBugs }; 