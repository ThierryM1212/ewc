let fs = require('fs');

// setup.js
module.exports = async () => {
    // copy wallets to the test folder before the tests
    fs.cpSync('wallets', 'build/wallets', { force: true, recursive: true });

};