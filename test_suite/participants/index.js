const offblocks = require('./offblocks');
const validatedid = require('./validatedid');

const participants = {
    offblocks,
    validatedid,
};

module.exports = Object.values(participants);
