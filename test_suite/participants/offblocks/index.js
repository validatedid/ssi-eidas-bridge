const credentials = require('./credentials');
const sealed_credentials = require('./sealed_credentials');
const certificates = require('./certificates');

module.exports = {
    name: 'Off-Blocks',
    eidas_api_base_url: 'https://eidas-bridge.dev.sphereon.io/eidas-bridge',
    credentials: [...credentials],
    sealed_credentials: [...sealed_credentials],
    certificates: [...certificates],
};
