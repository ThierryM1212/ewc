let fs = require('fs');

function deleteIfExists(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

// cleanup after tests
module.exports = async () => {
    deleteIfExists('build/wallets/test.wallet');
    deleteIfExists('build/wallets/test26.wallet');
    deleteIfExists('build/wallets/test123.wallet');
    deleteIfExists('build/wallets/testT.wallet');
    deleteIfExists('build/wallets/testWallet_empty_account_list.wallet');
    deleteIfExists('build/wallets/testWallet_empty_address_list.wallet');
    deleteIfExists('build/wallets/testWallet_invalid.wallet');
    deleteIfExists('build/wallets/testWallet0.wallet');
    deleteIfExists('build/wallets/testWallet1.wallet');
    deleteIfExists('build/wallets/testWallet1updated.wallet');
    deleteIfExists('build/wallets/testWallet3.wallet');
    deleteIfExists('build/wallets/testWallet4.wallet');
    deleteIfExists('build/wallets/testWalletEWC0.wallet');
    deleteIfExists('build/wallets/testWalletEWC1.wallet');
    deleteIfExists('build/wallets/testWalletNSC1.wallet');
    deleteIfExists('build/wallets/testWalletNWC1.wallet');
    deleteIfExists('build/wallets/testWalletNWC2.wallet');

};