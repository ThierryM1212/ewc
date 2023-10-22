import { WalletAccount } from './WalletAccount';
import { WalletAddress } from "./WalletAddress";

describe('Test WalletAccount.ts', () => {
    let add0 = new WalletAddress("9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa", 0, false);
    let add1 = new WalletAddress("9g16ZMPo22b3qaRL7HezyQt2HSW2ZBF6YR3WW9cYQjgQwYKxxoT", 1, false);
    let acc = new WalletAccount(0, [add0, add1]);
    test('WalletAccount - 0', async () => {
      expect(acc.index).toBe(0);
      acc.index = 1;
      expect(acc.index).toBe(1);
      expect(acc.addressList).toEqual([add0, add1]);
      acc.removeAddress("9hXGf211iQbeEXGE4VvcFGPbF4QR84PQUM5VWQJQ9E6rnewwBVa");
      expect(acc.addressList).toEqual([add1]);
      acc.addAddress(add0);
      expect(acc.addressList).toEqual([add1, add0]);
      acc.addressList = [add0, add1];
      expect(acc.addressList).toEqual([add0, add1]);
    })
  });
