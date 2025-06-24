const { getUsers } = require('./projectDataService');

const generateMockCommits = async () => {
    const users = await getUsers();
    const commits = [];
    const messages = [
        "feat: implement user authentication",
        "fix: resolve login button bug",
        "docs: update API documentation",
        "style: format code with Prettier",
        "refactor: improve database query performance",
        "test: add unit tests for new feature",
        "chore: update dependencies"
    ];

    for (let i = 1; i <= 50; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        commits.push({
            id: i,
            sha: require('crypto').randomBytes(20).toString('hex'),
            userId: user.id,
            userName: user.name,
            message: messages[Math.floor(Math.random() * messages.length)],
            date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
        });
    }
    return commits;
};

module.exports = { generateMockCommits }; 