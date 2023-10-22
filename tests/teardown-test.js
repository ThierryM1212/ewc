let fs = require('fs');

// cleanup after tests
module.exports = async () => {
    fs.unlinkSync('build/wallets/test.wallet');
    fs.unlinkSync('build/wallets/test26.wallet');
    fs.unlinkSync('build/wallets/test123.wallet');
    fs.unlinkSync('build/wallets/testT.wallet');
    fs.unlinkSync('build/wallets/testWallet_empty_account_list.wallet');
    fs.unlinkSync('build/wallets/testWallet_empty_address_list.wallet');
    fs.unlinkSync('build/wallets/testWallet_invalid.wallet');
    fs.unlinkSync('build/wallets/testWallet0.wallet');
    fs.unlinkSync('build/wallets/testWallet1.wallet');
    fs.unlinkSync('build/wallets/testWallet1updated.wallet');
    fs.unlinkSync('build/wallets/testWallet3.wallet');
    fs.unlinkSync('build/wallets/testWallet4.wallet');
    fs.unlinkSync('build/wallets/testWalletEWC0.wallet');
    fs.unlinkSync('build/wallets/testWalletEWC1.wallet');
    fs.unlinkSync('build/wallets/testWalletNSC1.wallet');
    fs.unlinkSync('build/wallets/testWalletNWC1.wallet');
    fs.unlinkSync('build/wallets/testWalletNWC2.wallet');

};