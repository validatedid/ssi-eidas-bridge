const credentials = require('./credentials');
const sealed_credentials = require('./sealed_credentials');
const certificates = require('./certificates');

module.exports = {
    name: 'Validated ID',
    eidas_api_base_url: 'https://api.vidchain.net/eidas-bridge',
    credentials: [...credentials],
    sealed_credentials: [...sealed_credentials],
    certificates: [...certificates],
};
