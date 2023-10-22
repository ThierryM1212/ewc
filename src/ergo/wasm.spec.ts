import { Network } from '@fleet-sdk/common';
import { Wallet, ErgoStateContext } from 'ergo-lib-wasm-nodejs';
import { getErgoStateContext, getWalletForAddresses } from './wasm';


test('wasm - 0', async () => {
    const wasmWallet = await getWalletForAddresses(Network.Mainnet, "kiss water essence horse scan useless floor panel vast apart fall chimney", "", ["9ewPncM4s3w64Xc9ZB7FSX1GRctanjiajCJ5LDexTi6yLMx2JDr"])
    expect(wasmWallet).toBeInstanceOf(Wallet);
    const stateContext = await getErgoStateContext(Network.Mainnet)
    expect(stateContext).toBeInstanceOf(ErgoStateContext);

})

test('wasm - 0', async () => {
    const wasmWallet = await getWalletForAddresses(Network.Mainnet, "kiss water essence horse scan useless floor panel vast apart fall chimney", "", ["not_addr"])
    expect(wasmWallet).toBeInstanceOf(Wallet);
    const stateContext = await getErgoStateContext(Network.Mainnet)
    expect(stateContext).toBeInstanceOf(ErgoStateContext);

})