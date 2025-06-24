const { getUsers } = require('./projectDataService');
const { getTasks } = require('./projectDataService');

const generateMockTimeLogs = async () => {
    const users = await getUsers();
    const tasks = await getTasks();
    const timeLogs = [];

    for (let i = 1; i <= 100; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        timeLogs.push({
            id: i,
            userId: user.id,
            userName: user.name,
            taskId: task.id,
            taskTitle: task.title,
            hours: (Math.random() * 8 + 0.5).toFixed(1), // Log between 0.5 and 8.5 hours
            date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
        });
    }
    return timeLogs;
};

module.exports = { generateMockTimeLogs }; 