const express = require('express');
const router = express.Router();

const { getDashboardData, getKpis, getInsights, getCommits, getBugs, getTimeLogs } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');

// All dashboard routes are protected, requiring a valid JWT
router.use(protect);
router.get('/', getDashboardData);
router.get('/kpis', getKpis);
router.get('/insights', getInsights);
router.get('/commits', getCommits);
router.get('/bugs', getBugs);
router.get('/timelogs', getTimeLogs);


module.exports = router; 