var path = require('path');


PROJECT_ROOT = path.dirname(__filename);
SOURCE_ROOT = path.join(PROJECT_ROOT, 'src');

DB = {
  HOST: 'localhost',
  PORT: 3306,
  USERNAME: 'pine',
  PASSWORD: process.env.PASSWORD
};

BASE_IMAGE_URL = 'http://images.recover39.com/';