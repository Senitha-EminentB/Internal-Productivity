const projectDataService = require('../services/projectDataService');
const insightService = require('../services/insightService');
const commitService = require('../services/commitService');
const bugService = require('../services/bugService');
const timeLogService = require('../services/timeLogService');
const reportService = require('../services/reportService');

const filterByDateRange = (items, range) => {
    if (!range) return items;
    const now = new Date();
    let from;
    if (range === 'week') {
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (range === 'month') {
        from = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else {
        return items;
    }
    return items.filter(item => {
        const itemDate = new Date(item.date || item.createdAt);
        return itemDate >= from;
    });
};

const getDashboardData = async (req, res) => {
    try {
        const { range } = req.query; // 'week', 'month'
        const [tasks, users, commits, bugs, timeLogs] = await Promise.all([
            projectDataService.getTasks(),
            projectDataService.getUsers(),
            commitService.getCommits ? commitService.getCommits() : commitService.generateMockCommits(),
            bugService.getBugs ? bugService.getBugs() : bugService.generateMockBugs(),
            timeLogService.getTimeLogs ? timeLogService.getTimeLogs() : timeLogService.generateMockTimeLogs()
        ]);

        const filteredTasks = filterByDateRange(tasks, range);
        const filteredCommits = filterByDateRange(commits, range);
        const filteredBugs = filterByDateRange(bugs, range);
        const filteredTimeLogs = filterByDateRange(timeLogs, range);

        const kpis = {
            totalTasks: filteredTasks.length,
            completedTasks: filteredTasks.filter(task => task.completed).length,
            openTasks: filteredTasks.filter(task => !task.completed).length,
            totalCommits: filteredCommits.length,
            openBugs: filteredBugs.filter(bug => bug.status !== 'closed').length,
        };

        res.json({ 
            kpis, 
            tasks: filteredTasks, 
            users, 
            commits: filteredCommits, 
            bugs: filteredBugs, 
            timeLogs: filteredTimeLogs 
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
};

const getKpis = async (req, res) => {
    try {
        const { range } = req.query;
        const [tasks, commits, bugs] = await Promise.all([
            projectDataService.getTasks(),
            commitService.getCommits ? commitService.getCommits() : commitService.generateMockCommits(),
            bugService.getBugs ? bugService.getBugs() : bugService.generateMockBugs(),
        ]);

        const filteredTasks = filterByDateRange(tasks, range);
        const filteredCommits = filterByDateRange(commits, range);
        const filteredBugs = filterByDateRange(bugs, range);

        res.json({
            totalTasks: filteredTasks.length,
            completedTasks: filteredTasks.filter(task => task.completed).length,
            openTasks: filteredTasks.filter(task => !task.completed).length,
            totalCommits: filteredCommits.length,
            openBugs: filteredBugs.filter(bug => bug.status !== 'closed').length,
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
            commitService.getCommits ? commitService.getCommits() : commitService.generateMockCommits(),
            bugService.getBugs ? bugService.getBugs() : bugService.generateMockBugs(),
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
        const commits = commitService.getCommits 
            ? await commitService.getCommits() 
            : await commitService.generateMockCommits();
        res.json(commits);
    } catch (error) {
        console.error('Error fetching commits:', error);
        res.status(500).json({ message: 'Failed to fetch commits' });
    }
};

const getBugs = async (req, res) => {
    try {
        const bugs = bugService.getBugs 
            ? await bugService.getBugs() 
            : await bugService.generateMockBugs();
        res.json(bugs);
    } catch (error) {
        console.error('Error fetching bugs:', error);
        res.status(500).json({ message: 'Failed to fetch bugs' });
    }
};

const getTimeLogs = async (req, res) => {
    try {
        const timeLogs = timeLogService.getTimeLogs 
            ? await timeLogService.getTimeLogs() 
            : await timeLogService.generateMockTimeLogs();
        res.json(timeLogs);
    } catch (error) {
        console.error('Error fetching time logs:', error);
        res.status(500).json({ message: 'Failed to fetch time logs' });
    }
};

const exportReport = async (req, res) => {
    try {
        const { format } = req.params; // 'csv' or 'pdf'
        const [tasks, commits, bugs, timeLogs] = await Promise.all([
            projectDataService.getTasks(),
            commitService.getCommits ? commitService.getCommits() : commitService.generateMockCommits(),
            bugService.getBugs ? bugService.getBugs() : bugService.generateMockBugs(),
            timeLogService.getTimeLogs ? timeLogService.getTimeLogs() : timeLogService.generateMockTimeLogs()
        ]);
        const data = { tasks, commits, bugs, timeLogs };

        if (format === 'csv') {
            res.header('Content-Type', 'text/csv');
            res.attachment('report.csv');
            return reportService.generateCsv(res, data);
        } else if (format === 'pdf') {
            res.header('Content-Type', 'application/pdf');
            res.attachment('report.pdf');
            return reportService.generatePdf(res, data);
        }
        return res.status(400).send('Invalid format');

    } catch (error) {
        console.error(`Error exporting ${req.params.format} report:`, error);
        res.status(500).send('Failed to export report');
    }
};

module.exports = {
    getDashboardData,
    getKpis,
    getInsights,
    getCommits,
    getBugs,
    getTimeLogs,
    exportReport,
};