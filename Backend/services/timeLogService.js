const cron = require('node-cron');
const { getUsers, getTasks, ready } = require('./projectDataService');

let cachedTimeLogs = [];

const generateMockTimeLogs = async () => {
    const users = await getUsers();
    const tasks = await getTasks();
    const timeLogs = [];

    if (users.length === 0 || tasks.length === 0) return [];

    for (let i = 1; i <= 100; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        timeLogs.push({
            id: i,
            userId: user.id,
            userName: user.name,
            taskId: task.id,
            taskTitle: task.title,
            hours: (Math.random() * 8 + 0.5).toFixed(1), // 0.5 to 8.5 hours
            date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
        });
    }

    return timeLogs;
};

const refreshData = async () => {
    await ready(); // Ensure projectDataService is ready
    cachedTimeLogs = await generateMockTimeLogs();
    console.log('Mock time logs refreshed at', new Date());
};

// Initial load & daily refresh
refreshData();
cron.schedule('0 0 * * *', refreshData); // Runs every day at midnight

const getTimeLogs = async () => cachedTimeLogs;

module.exports = { getTimeLogs };
