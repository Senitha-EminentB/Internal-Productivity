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

// Filter data based on user role
const filterDataByRole = (data, userRole, userId, userTeam) => {
    if (userRole === 'admin') {
        return data; // Admin gets full access
    } else if (userRole === 'manager') {
        // Manager gets team-level access
        return data.filter(item => {
            if (item.userId) {
                return item.team === userTeam;
            }
            if (item.assignedTo) {
                return item.assignedTo.team === userTeam;
            }
            return true; // Keep items without user/team info
        });
    } else {
        // Developer gets personal access only
        return data.filter(item => {
            if (item.userId) {
                return item.userId === userId;
            }
            if (item.assignedTo) {
                return item.assignedTo.id === userId;
            }
            return false; // Filter out items without clear user association
        });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const { range } = req.query; // 'week', 'month'
        const userRole = req.user.role;
        const userId = req.user._id;
        const userTeam = req.user.team;

        let [tasks, users, commits, bugs, timeLogs] = await Promise.all([
            projectDataService.getTasks(),
            projectDataService.getUsers(),
            commitService.getCommits ? commitService.getCommits() : commitService.generateMockCommits(),
            bugService.getBugs ? bugService.getBugs() : bugService.generateMockBugs(),
            timeLogService.getTimeLogs ? timeLogService.getTimeLogs() : timeLogService.generateMockTimeLogs()
        ]);

        // Patch: Assign some data to the developer's MongoDB _id
        if (userRole === 'developer') {
            // Patch tasks
            tasks = tasks.map((task, idx) => idx < 5 ? { ...task, userId: userId } : task);
            // Patch commits
            commits = commits.map((commit, idx) => idx < 5 ? { ...commit, userId: userId } : commit);
            // Patch bugs
            bugs = bugs.map((bug, idx) => idx < 3 ? { ...bug, assignedTo: userId } : bug);
            // Patch timeLogs
            timeLogs = timeLogs.map((log, idx) => idx < 5 ? { ...log, userId: userId } : log);
        }

        // Filter data based on user role
        const filteredTasks = filterByDateRange(tasks, range);
        const filteredCommits = filterByDateRange(commits, range);
        const filteredBugs = filterByDateRange(bugs, range);
        const filteredTimeLogs = filterByDateRange(timeLogs, range);

        // Apply role-based filtering
        const roleFilteredTasks = filterDataByRole(filteredTasks, userRole, userId, userTeam);
        const roleFilteredCommits = filterDataByRole(filteredCommits, userRole, userId, userTeam);
        const roleFilteredBugs = filterDataByRole(filteredBugs, userRole, userId, userTeam);
        const roleFilteredTimeLogs = filterDataByRole(filteredTimeLogs, userRole, userId, userTeam);

        // Filter users based on role
        let roleFilteredUsers = users;
        if (userRole === 'manager') {
            roleFilteredUsers = users.filter(user => user.team === userTeam);
        } else if (userRole === 'developer') {
            roleFilteredUsers = users.filter(user => user._id === userId);
        }

        const kpis = {
            totalTasks: roleFilteredTasks.length,
            completedTasks: roleFilteredTasks.filter(task => task.completed).length,
            openTasks: roleFilteredTasks.filter(task => !task.completed).length,
            totalCommits: roleFilteredCommits.length,
            openBugs: roleFilteredBugs.filter(bug => bug.status !== 'closed').length,
        };

        // Debug logging for developer
        if (userRole === 'developer') {
            console.log('Developer Dashboard Debug:');
            console.log('User:', { userId, userTeam });
            console.log('Filtered Tasks:', roleFilteredTasks);
            console.log('Filtered Commits:', roleFilteredCommits);
            console.log('Filtered Bugs:', roleFilteredBugs);
            console.log('Filtered TimeLogs:', roleFilteredTimeLogs);
            console.log('Response KPIs:', kpis);
        }

        res.json({ 
            kpis, 
            tasks: roleFilteredTasks, 
            users: roleFilteredUsers, 
            commits: roleFilteredCommits, 
            bugs: roleFilteredBugs, 
            timeLogs: roleFilteredTimeLogs 
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
};

const getKpis = async (req, res) => {
    try {
        const { range } = req.query;
        const userRole = req.user.role;
        const userId = req.user._id;
        const userTeam = req.user.team;

        const [tasks, commits, bugs] = await Promise.all([
            projectDataService.getTasks(),
            commitService.getCommits ? commitService.getCommits() : commitService.generateMockCommits(),
            bugService.getBugs ? bugService.getBugs() : bugService.generateMockBugs(),
        ]);

        const filteredTasks = filterByDateRange(tasks, range);
        const filteredCommits = filterByDateRange(commits, range);
        const filteredBugs = filterByDateRange(bugs, range);

        // Apply role-based filtering
        const roleFilteredTasks = filterDataByRole(filteredTasks, userRole, userId, userTeam);
        const roleFilteredCommits = filterDataByRole(filteredCommits, userRole, userId, userTeam);
        const roleFilteredBugs = filterDataByRole(filteredBugs, userRole, userId, userTeam);

        res.json({
            totalTasks: roleFilteredTasks.length,
            completedTasks: roleFilteredTasks.filter(task => task.completed).length,
            openTasks: roleFilteredTasks.filter(task => !task.completed).length,
            totalCommits: roleFilteredCommits.length,
            openBugs: roleFilteredBugs.filter(bug => bug.status !== 'closed').length,
        });
    } catch (error) {
        console.error('Error fetching KPIs:', error);
        res.status(500).json({ message: 'Failed to fetch KPIs' });
    }
};

const getInsights = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        const userTeam = req.user.team;

        const [tasks, users, commits, bugs] = await Promise.all([
            projectDataService.getTasks(),
            projectDataService.getUsers(),
            commitService.getCommits ? commitService.getCommits() : commitService.generateMockCommits(),
            bugService.getBugs ? bugService.getBugs() : bugService.generateMockBugs(),
        ]);

        // Apply role-based filtering
        const roleFilteredTasks = filterDataByRole(tasks, userRole, userId, userTeam);
        const roleFilteredUsers = userRole === 'admin' ? users : 
                                 userRole === 'manager' ? users.filter(user => user.team === userTeam) :
                                 users.filter(user => user._id === userId);
        const roleFilteredCommits = filterDataByRole(commits, userRole, userId, userTeam);
        const roleFilteredBugs = filterDataByRole(bugs, userRole, userId, userTeam);

        const insights = insightService.generateInsights(roleFilteredTasks, roleFilteredUsers, roleFilteredCommits, roleFilteredBugs);
        res.json({ insights });
    } catch (error) {
        console.error('Error fetching insights:', error);
        res.status(500).json({ message: 'Failed to fetch insights' });
    }
};

const getCommits = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        const userTeam = req.user.team;

        const commits = commitService.getCommits 
            ? await commitService.getCommits() 
            : await commitService.generateMockCommits();
        
        const filteredCommits = filterDataByRole(commits, userRole, userId, userTeam);
        res.json(filteredCommits);
    } catch (error) {
        console.error('Error fetching commits:', error);
        res.status(500).json({ message: 'Failed to fetch commits' });
    }
};

const getBugs = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        const userTeam = req.user.team;

        const bugs = bugService.getBugs 
            ? await bugService.getBugs() 
            : await bugService.generateMockBugs();
        
        const filteredBugs = filterDataByRole(bugs, userRole, userId, userTeam);
        res.json(filteredBugs);
    } catch (error) {
        console.error('Error fetching bugs:', error);
        res.status(500).json({ message: 'Failed to fetch bugs' });
    }
};

const getTimeLogs = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        const userTeam = req.user.team;

        const timeLogs = timeLogService.getTimeLogs 
            ? await timeLogService.getTimeLogs() 
            : await timeLogService.generateMockTimeLogs();
        
        const filteredTimeLogs = filterDataByRole(timeLogs, userRole, userId, userTeam);
        res.json(filteredTimeLogs);
    } catch (error) {
        console.error('Error fetching time logs:', error);
        res.status(500).json({ message: 'Failed to fetch time logs' });
    }
};

const exportReport = async (req, res) => {
    try {
        const { format } = req.params; // 'csv' or 'pdf'
        const userRole = req.user.role;
        const userId = req.user._id;
        const userTeam = req.user.team;

        const [tasks, commits, bugs, timeLogs] = await Promise.all([
            projectDataService.getTasks(),
            commitService.getCommits ? commitService.getCommits() : commitService.generateMockCommits(),
            bugService.getBugs ? bugService.getBugs() : bugService.generateMockBugs(),
            timeLogService.getTimeLogs ? timeLogService.getTimeLogs() : timeLogService.generateMockTimeLogs()
        ]);

        // Apply role-based filtering
        const roleFilteredTasks = filterDataByRole(tasks, userRole, userId, userTeam);
        const roleFilteredCommits = filterDataByRole(commits, userRole, userId, userTeam);
        const roleFilteredBugs = filterDataByRole(bugs, userRole, userId, userTeam);
        const roleFilteredTimeLogs = filterDataByRole(timeLogs, userRole, userId, userTeam);

        const data = { 
            tasks: roleFilteredTasks, 
            commits: roleFilteredCommits, 
            bugs: roleFilteredBugs, 
            timeLogs: roleFilteredTimeLogs 
        };

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