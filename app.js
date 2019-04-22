"use strict";
const config = require('./config')

var io = require('./connector')(config.port)

