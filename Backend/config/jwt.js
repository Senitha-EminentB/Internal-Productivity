require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTc1MDc0NDk5NSwiaWF0IjoxNzUwNzQ0OTk1fQ.s4FQdwitasa5BQgRnZOY7A5XYRAnFf7XsokyTcUmSB8',
  jwtExpiration: '5d' // 5 days
};