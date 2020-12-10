let config = require('dotenv').config()

if (config && process.env) {
  config = Object.assign(config, process.env)
} else if (process.env) {
  config = process.env
} else {
  config = {}
}

module.exports = config
