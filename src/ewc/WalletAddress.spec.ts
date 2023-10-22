import { WalletAddress } from "./WalletAddress";

describe('Test WalletAddress.ts', () => {
  let add = new WalletAddress("9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa", 0, false);
  test('WalletAddress - 0', async () => {
    expect(add.pk).toBe('9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa');
    expect(add.index).toBe(0);
    expect(add.used).toBe(false);
    await add.updateAddressUsed();
    expect(add.used).toBe(false);
    add.pk = '9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT';
    expect(add.pk).toBe('9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT');
    add.index = 1;
    expect(add.index).toBe(1);
    await add.updateAddressUsed();
    expect(add.used).toBe(true);
  })
});