let fs = require('fs');

// setup.js
module.exports = async () => {
    // copy wallets to the test folder before the tests
    fs.cpSync('wallets', 'build/wallets', { force: true, recursive: true });

    // disable wallet file encryption for testing by default
    if (process.env.EWC_ENC_KEY && process.env.EWC_ENC_KEY !== 'undefined' ) {
        process.env.EWC_ENC_KEY_BACKUP = process.env.EWC_ENC_KEY;
        delete process.env.EWC_ENC_KEY;
    }
    
};