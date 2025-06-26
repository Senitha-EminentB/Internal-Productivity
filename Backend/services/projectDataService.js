const API_URL = 'https://jsonplaceholder.typicode.com';
const cron = require('node-cron');
let cachedTasks = [];
let cachedUsers = [];
let lastUpdated = null;
let isReady = false;
let readyPromise = null;

const fetchTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const refreshData = async () => {
  isReady = false;
  readyPromise = (async () => {
    try {
      const tasksRaw = await fetchTasks();
      cachedUsers = await fetchUsers();
      // Enhance tasks with createdAt, userId, and team fields
      cachedTasks = tasksRaw.map(task => {
        const user = cachedUsers.length > 0 ? cachedUsers[Math.floor(Math.random() * cachedUsers.length)] : null;
        return {
          ...task,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
          userId: user ? user.id : undefined,
          team: user ? user.team : undefined,
          deadline: new Date(Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
        };
      });
      lastUpdated = new Date();
      console.log('Data refreshed at', lastUpdated);
      isReady = true;
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    }
  })();
  await readyPromise;
};

// Initial load
refreshData();
// Refresh daily at midnight
cron.schedule('0 0 * * *', refreshData);

const getTasks = async (filter = {}) => {
  if (!isReady) await ready();
  
  // Optionally filter by week/month/sprint
  let tasks = cachedTasks;
  if (filter.range) {
    const now = new Date();
    let from;
    if (filter.range === 'week') {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (filter.range === 'month') {
      from = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } // Add sprint logic if needed
    tasks = tasks.filter(t => {
      const created = t.createdAt ? new Date(t.createdAt) : now;
      return created >= from;
    });
  }
  return tasks;
};

const getUsers = async () => {
  if (!isReady) await ready();
  return cachedUsers;
};

const ready = async () => {
  if (isReady) return;
  if (readyPromise) await readyPromise;
};

module.exports = {
  getTasks,
  getUsers,
  refreshData,
  lastUpdated: () => lastUpdated,
  ready,
};