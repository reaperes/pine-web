var path = require('path');


PROJECT_ROOT = path.dirname(__filename);
SOURCE_ROOT = path.join(PROJECT_ROOT, 'src');

DB = {
  HOST: 'localhost',
  PORT: 3306,
  USERNAME: 'pine',
  PASSWORD: process.env.PASSWORD,
  DATABASE: 'pine_pro'
};

IMAGE_BASE_URL = 'http://images.recover39.com/';
API_BASE_URL = 'http://125.209.194.90:3000';