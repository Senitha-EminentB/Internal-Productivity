const projectDataService = require('../services/projectDataService');
const insightService = require('../services/insightService');
const commitService = require('../services/commitService');
const bugService = require('../services/bugService');
const timeLogService = require('../services/timeLogService');

const getDashboardData = async (req, res) => {
    try {
        const [tasks, users, commits, bugs, timeLogs] = await Promise.all([
            projectDataService.getTasks(),
            projectDataService.getUsers(),
            commitService.generateMockCommits(),
            bugService.generateMockBugs(),
            timeLogService.generateMockTimeLogs()
        ]);

        res.json({ tasks, users, commits, bugs, timeLogs });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
};

const getKpis = async (req, res) => {
    try {
        const tasks = await projectDataService.getTasks();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const openTasks = totalTasks - completedTasks;
        const bugs = await bugService.generateMockBugs();
        const commits = await commitService.generateMockCommits();
        const openBugs = bugs.filter(bug => bug.status !== 'closed').length;

        res.json({
            totalTasks,
            completedTasks,
            openTasks,
            totalCommits: commits.length,
            openBugs,
        });
    } catch (error) {
        console.error('Error fetching KPIs:', error);
        res.status(500).json({ message: 'Failed to fetch KPIs' });
    }
};

const getInsights = async (req, res) => {
    try {
        const [tasks, users, commits, bugs] = await Promise.all([
            projectDataService.getTasks(),
            projectDataService.getUsers(),
            commitService.generateMockCommits(),
            bugService.generateMockBugs(),
        ]);

        const insights = insightService.generateInsights(tasks, users, commits, bugs);
        res.json({ insights });
    } catch (error) {
        console.error('Error fetching insights:', error);
        res.status(500).json({ message: 'Failed to fetch insights' });
    }
};

const getCommits = async (req, res) => {
    try {
        const commits = await commitService.generateMockCommits();
        res.json(commits);
    } catch (error) {
        console.error('Error fetching commits:', error);
        res.status(500).json({ message: 'Failed to fetch commits' });
    }
};

const getBugs = async (req, res) => {
    try {
        const bugs = await bugService.generateMockBugs();
        res.json(bugs);
    } catch (error) {
        console.error('Error fetching bugs:', error);
        res.status(500).json({ message: 'Failed to fetch bugs' });
    }
};

const getTimeLogs = async (req, res) => {
    try {
        const timeLogs = await timeLogService.generateMockTimeLogs();
        res.json(timeLogs);
    } catch (error) {
        console.error('Error fetching time logs:', error);
        res.status(500).json({ message: 'Failed to fetch time logs' });
    }
};

module.exports = {
    getDashboardData,
    getKpis,
    getInsights,
    getCommits,
    getBugs,
    getTimeLogs,
}; 